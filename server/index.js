
require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` });
const express = require("express");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const bcrypt = require('bcryptjs');
const { sequelize, User, Product, Order } = require('./models');
const jwt = require('jsonwebtoken');
const transporter = require('./mailer');
const QRCode = require('qrcode');
const multer = require('multer');
const fs = require('fs');
const https = require('https');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS;
const DOMAIN = process.env.DOMAIN;

const corsOptions = {
  origin: ALLOWED_ORIGINS,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Upgrade',
    'Connection',
    'Sec-WebSocket-Key',
    'Sec-WebSocket-Version',
    'Sec-WebSocket-Protocol',
    'Sec-WebSocket-Extensions'
  ],
  credentials: true
};
// middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// save photos in the uploads dir
const uploadDir = path.join(__dirname, 'uploads');
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

// ws broadcast function
let wss;
const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};
const broadcastCoffee = (data, userLogin) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client.userLogin === userLogin) {
      client.send(JSON.stringify(data));
    }
  });
};

// user creates an order
app.post('/api/shop', async (req, res) => {
  const { title, name, phone, date, login, photo, count, time } = req.body;

  try{
    const newOrder = await Order.create({ title, name, phone, date, login, photo, count, time });

    broadcast({
      type: 'newOrder',
      order: newOrder
    });

    res.status(201).json(newOrder);
  }catch(error){
    console.error('Order error:', error);
    res.status(500).json({ error: 'Order error!' });
  };
});

// admin accepts an order
app.post('/api/news', async (req, res) => {
  const { title, name } = req.body;

  try{
    const anOrder = await Order.findOne({ where: { title: title, name: name } });
    if(!anOrder){
      res.status(404).json({ error: 'Order was not found' });
    }

    anOrder.isaccepted = true;
    await anOrder.save();

    res.status(200).json({ message: `Client order ${name} - approved` });
  }catch(error){
    console.error('Order approved error:', error);
    res.status(500).json({ error: 'Order approved error' });
  };
});

// admin deletes an order
app.delete('/api/news', async (req, res) => {
  const { title, name } = req.body;

  try{
    const result = await Order.destroy({ where: { title: title, name: name } });
    if (result > 0) {
      res.status(200).json({ message: 'Order successfully deleted' });
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  }catch(error){
    console.error('Order delete error:', error);
    res.status(500).json({ error: 'Order delete error' });
  }
});

// admin/user gets all/his orders
app.get('/api/news/:login', async (req, res) => {
  const { login } = req.params;

  try{
    const user = await User.findOne({ where: { login: login } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    };

    const isAdmin = user.admin;

    if(isAdmin){
      const orders = await Order.findAll();
      res.status(200).json(orders);
    }else{
      const userOrders = await Order.findAll({ where: { login: login }});
      res.status(200).json(userOrders);
    }

  }catch(error){
    console.error('Order receiving error:', error);
    res.status(500).json({ error: 'Order receiving error' });
  };
});

// admin adds a product
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

    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Error adding product' });
  }
});

// admin promotes user as "friend"
app.post('/api/admin-settings/add-friend', async (req, res) => {
  const {login} = req.body;
  try {
    const user = await User.findOne({ where: { login: login } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.friend = true;
    await user.save();

    res.status(200).json({ message: 'User added to friends' });
  } catch(error) {
    console.error('User addind to friends error:', error);
    res.status(500).json({ error: 'User addind to friends error' });
  }

});

// admin promotes user as "admin"
app.post('/api/admin-settings/add-admin', async (req, res) => {
  const {login} = req.body;

  try {
    const user = await User.findOne({ where: { login: login } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.admin = true;
    await user.save();

    res.status(200).json({ message: 'User added as admin' });
  } catch(error) {
    console.error('Error adding new administrator:', error);
    res.status(500).json({ error: 'Error adding new administrator' });
  }

});

// admin destroys a product
app.delete('/api/home', async (req, res) => {
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

      res.status(200).json({ message: 'Product removed successfully' });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error deleting products:', error);
    res.status(500).json({ error: 'Error deleting products' });
  }
});

// user get all products in the 'home' route
app.get('/api/home', async (req, res) => {

  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error when receiving products:', error);
    res.status(500).json({ error: 'Error when receiving products' });
  }

});

// user get specific product
app.get('/api/home/:productTitle', async (req, res) => {
  const {productTitle} = req.params;

  try {
    const product = await Product.findOne({ where: { title: productTitle } });
    if(product) {
      console.log(`${product} is sent to client!`)
      res.json({
        title: product.title,
        photo: product.photo,
        description: product.description,
        ingredients: product.ingredients
      });
    }else{
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error retrieving product information:', error);
  }
});

// user get his coffee count
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
    console.error('Error retrieving coffee information:', error);
  }
});

// admin adds coffee to user in his db column
app.post('/api/admin-coffee', async (req, res) => {
  const { number, selectedCoffee } = req.body;

  if (!number || !selectedCoffee) {
    return res.status(400).json({ error: 'Number and selectedCoffee are required' });
  }

  const transaction = await sequelize.transaction();

  try {
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
    if (currentCoffeeCount === 7) {
      currentCoffeeCount = 8;
    }
    if (currentCoffeeCount > 8) {
      const diff = currentCoffeeCount - 8;
      currentCoffeeCount = diff;
    }

    user.coffee_count = currentCoffeeCount;

    await user.save({ transaction });

    await transaction.commit();

    broadcastCoffee({
      type: 'coffee',
      coffeeCount: currentCoffeeCount
    }, userLogin);

    res.status(200).json({ userLogin: userLogin });
  } catch (error) {
    console.error('Error crediting coffee:', error);
    await transaction.rollback();
    res.status(500).send('Error crediting coffee.');
  }
});


// qr-code functionality
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

    setTimeout(async () => {
      if(user.qr_code !== null){
        try {
          user.qr_code = null;
          await user.save();
        } catch (error) {
          console.error('Error clearing QR code:', error);
        }
      }
    }, 300000);

  } catch {
    res.status(500).send('Error renew QR code');
  }
});

// user's registration
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
    
    const activationLink = `${DOMAIN}/api/activate/${token}`

    const mailOptions = {
      from: 'your_email_here', /* TYPE YOUR EMAIL */
      to: email,
      subject: 'Account activation',
      html: `<p>Follow the link <a href="${activationLink}">YOUR_PASTRY_SHOP_NAME</a> to activate your account.</p>` /* TYPE YOUR_PASTRY_SHOP_NAME */
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'User registered, activation email sent' });
  } catch (err) {
    console.error('Registration error details:', err);
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
});

// token activation
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

    res.redirect(`${ALLOWED_ORIGINS}/activate/${token}`)
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Account activation failed' });
  }
});

// user's login
app.post('/api/login', async (req, res) => {
  const { login, password } = req.body;
  try {
    const user = await User.findOne({ where: { login } });

    if (!user || !user.isActivated) {
      return res.status(401).json({ error: 'Invalid login or user not activated' });
    }

    if (await bcrypt.compare(password, user.password)) {
      const accessToken = jwt.sign({ userId: user.id }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
      const refreshToken = jwt.sign({ userId: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: '60d' });

      user.refresh_token = refreshToken;
      await user.save();

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 24 * 60 * 60 * 1000
      });

      const role = user.admin;
      const friend = user.friend;

      return res.json({ accessToken, login, role, friend });
    } else {
      return res.status(401).json({ error: 'Invalid login or password' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'User login failed' });
  }
});

// refresh tokens
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

    const newAccessToken = jwt.sign({ userId: user.id }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

    return res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// client logout
app.post('/api/logout', (req, res) => {
  res.cookie('refreshToken', '', { maxAge: 0 });
  return res.status(200).json({ message: 'Logout successful' });
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connected with Sequelize');
    await sequelize.sync({ force: false });
    console.log('Database synchronized');
    
    let server;
    if(process.env.NODE_ENV === 'production') {
      const options = {
        key: fs.readFileSync('/etc/letsencrypt/live/your_domain_here/privkey.pem'), /* TYPE YOUR DOMAIN */
        cert: fs.readFileSync('/etc/letsencrypt/live/your_domain_here/fullchain.pem') /* TYPE YOUR DOMAIN */
      }
      server = https.createServer(options, app);
      wss = new WebSocket.Server( { 
        server,
        path: '/api/'
      } );
    }else{
      server = http.createServer(app);
      wss = new WebSocket.Server( { server });
    }    

    wss.on('connection', (ws) => {
      ws.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.type === 'login') {
          ws.userLogin = data.userLogin;
        }
        console.log('Received message:', message);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });

      ws.on('close', (code, reason) => {
        console.log(`Client disconnected with code: ${code}, reason: ${reason}`);
      });
    });
    console.log(`webSocket listening on ${PORT}`);

    server.listen(PORT, '0.0.0.0', () => console.log(`Server listening on ${PORT}`))

  } catch (err) {
    console.error('PostgreSQL connection error:', err);
  }
})();
