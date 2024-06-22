require('dotenv').config();
const express = require("express");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const { sequelize, User, Product } = require('./models');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const transporter = require('./mailer');
const QRCode = require('qrcode');
const { where } = require('sequelize');
const multer = require('multer');
const fs = require('fs');

const PORT = process.env.PORT || 3001;
const app = express();
const JWT_SECRET = 'k0raelstrazSfu110f1ight5Darkne5Ss';
const ACCESS_TOKEN_SECRET = 'k0raelstrazSfu110f1ight5Darkne5Ss'
const REFRESH_TOKEN_SECRET = 'k0raelstrazSfu110f1ight5Darkne5Ss'
// const corsOptions = {
//   origin: 'http://localhost:3000',
//   credentials: true,
// };

app.use(express.json());
app.use(cookieParser());
app.use(cors());

const uploadDir = './product-photos';

if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// добавление новых позиций продуктов
app.post('/api/admin-settings/add-product', upload.single('photo'), async (req, res) => {
  const {title, description, price, ingredients, chapter} = req.body;
  const photo = req.file ? req.file.filename : null;

  try {
    const newProduct = await Product.create({
      photo,
      title,
      description,
      price,
      ingredients,
      chapter
    });
    res.status(201).json(newProduct);
  } catch (error) {

    console.error('Ошибка при добавлении продукта:', error);
    res.status(500).json({ error: 'Произошла ошибка при добавлении продукта' });
  }
});

// удаление продукта админом
app.post('/api/home', async (req, res) => {
  const { title } = req.body;

  try {
    const product = await Product.findOne({ where: { title } });
    if(product) {
      if (product.photo) {
        const photoPath = path.join(uploadDir, product.photo);
        if (fs.existsSync(photoPath)) {
          fs.unlinkSync(photoPath);
        }
      }

      await product.destroy();

      res.status(200).json({ message: 'Продукт успешно удален' });
    } else {
      res.status(404).json({ error: 'Продукт не найден' });
    }
  } catch (error) {
    console.error('Ошибка при удалении продуктов:', error);
    res.status(500).json({ error: 'Произошла ошибка при удалении продуктов' });
  }
});

// получение продуктов в роут "дом"
app.get('/api/home', async (req, res) => {

  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    console.error('Ошибка при получении продуктов:', error);
    res.status(500).json({ error: 'Произошла ошибка при получении продуктов' });
  }

});

// получение количества кофе пользователем
app.get('/api/user-coffee/:login', async (req, res) => {
  const {login} = req.params;

  try {
    const user = await User.findOne({ where: { login }});
    if(user){
      res.json({ coffee: user.coffee_count });
    }else{
      res.status(404).json({ message: 'User not found' });
    }
  } catch(error) {
    console.error('Ошибка при получении информации о кофе:', error);
  }
});

// добавление кофе пользователю в бд администратором
app.post('/api/admin-coffee', async (req, res) => {
  const { number, selectedCoffee } = req.body;

  if (!number || !selectedCoffee) {
    return res.status(400).json({ error: 'Number and selectedCoffee are required' });
  }

  const transaction = await sequelize.transaction();

  try {
    // Найти пользователя по номеру с блокировкой для обновления
    const user = await User.findOne({ 
      where: { qr_code: number }, 
      lock: transaction.LOCK.UPDATE, 
      transaction 
    });
    const userLogin = user.login

    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ error: 'User not found' });
    }

    let currentCoffeeCount = user.coffee_count;

    const selectedCoffeeInt = parseInt(selectedCoffee, 10);

    currentCoffeeCount += selectedCoffeeInt;
    if (currentCoffeeCount === 9) {
      currentCoffeeCount = 1;
    }
    if (currentCoffeeCount > 8) {
      const diff = currentCoffeeCount - 8;
      currentCoffeeCount = diff;
    }

    user.coffee_count = currentCoffeeCount;

    // Сохранить изменения в базе данных с использованием транзакции
    await user.save({ transaction });

    // Завершить транзакцию
    await transaction.commit();

    res.status(200).json({ userLogin: userLogin });
  } catch (error) {
    console.error('Ошибка при зачислении кофе:', error);
    await transaction.rollback();
    res.status(500).send('Ошибка при зачислении кофе.');
  }
});


// функционал QR-code для пользователя
function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
app.post('/api/qr', async (req, res) => {
  const { login } = req.body;

  try {
    const user = await User.findOne({ where: { login } });
    
    const randomNumber = getRandomArbitrary(1000, 10000);
    const qrCodeDataURL = await QRCode.toDataURL(randomNumber.toString());

    user.qr_code = randomNumber;
    await user.save();
    
    res.json({
      number: randomNumber,
      qrCode: qrCodeDataURL,
    });

    // Удаление QR-кода через 5 минут у пользователя в бд
    setTimeout(async () => {
      if(user.qr_code !== null){
        try {
          user.qr_code = null;
          await user.save();
        } catch (error) {
          console.error('Ошибка очистки QR-кода:', error);
        }
      }
    }, 300000);
    
  } catch {
    res.status(500).send('Ошибка обновления QR-кода');
  }
});

// регистрация
app.post('/api/register', async (req, res) => {
  const { email, login, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { login } });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, login, password: hashedPassword });

    const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '1h' });
    const activationLink = `http://localhost:3000/activate/${token}`;

    const mailOptions = {
      from: 'thayornswordsman@gmail.com',
      to: email,
      subject: 'Активация аккаунта в Крем и Корж.',
      html: `<p>Пройдите по ссылке <a href="${activationLink}">Крем и Корж</a> для активации аккаунта.</p>`
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'User registered, activation email sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// активация токена
app.get('/api/activate/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ where: { id: decoded.id } });

    if (!user) {
      return res.status(400).json({ error: 'Invalid token or user not found' });
    }

    user.isActivated = true;
    await user.save();

    res.status(200).json({ message: 'Account activated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Account activation failed' });
  }
});

// логин юзера
app.post('/api/login', async (req, res) => {
  const { login, password } = req.body;
  try {
    const user = await User.findOne({ where: { login } });

    if (!user || !user.isActivated) {
      return res.status(401).json({ error: 'Invalid login or user not activated' });
    }

    if (await bcrypt.compare(password, user.password)) {
      const accessToken = jwt.sign({ userId: user.id }, ACCESS_TOKEN_SECRET, { expiresIn: '10s' });
      const refreshToken = jwt.sign({ userId: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: '60d' });

      user.refresh_token = refreshToken;
      await user.save();

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 24 * 60 * 60 * 1000 // 60 days
      });
      
      const role = user.admin;

      return res.json({ accessToken, login, role });
    } else {
      return res.status(401).json({ error: 'Invalid login or password' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'User login failed' });
  }
});

// обновление токенов
app.post('/api/refresh-token', async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token not found' });
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const user = await User.findOne({ where: { id: decoded.userId, refresh_token: refreshToken } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid refresh token or user not found' });
    }

    const newAccessToken = jwt.sign({ userId: user.id }, ACCESS_TOKEN_SECRET, { expiresIn: '10s' });

    return res.json({ accessToken: newAccessToken }); 
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// завершение сеанса (logout)
app.post('/api/logout', (req, res) => {
  res.cookie('refreshToken', '', { maxAge: 0 });
  return res.status(200).json({ message: 'Logout successful' });
});

// запуск сервера с бд
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connected with Sequelize');
    await sequelize.sync({ force: false });
    console.log('Database synchronized');

    app.use(express.static(path.resolve(__dirname, '../client/build')));

    app.get('/api/message', (req, res) => {
      res.json({ message: "сервер запущен и передаёт данные" });
    });

    app.get('/api', async (req, res) => {
      try {
        const users = await User.findAll();
        res.json(users);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database query error' });
      }
    });

    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
    });

    app.listen(PORT, () => {
      console.log(`Server listening on ${PORT}`);
    });
  } catch (err) {
    console.error('PostgreSQL connection error:', err);
  }
}
startServer();
