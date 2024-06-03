require('dotenv').config();
const express = require("express");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const { sequelize, User } = require('./models');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const transporter = require('./mailer');

const PORT = process.env.PORT || 3001;
const app = express();
const JWT_SECRET = 'k0raelstrazSfu110f1ight5Darkne5Ss';
const ACCESS_TOKEN_SECRET = 'k0raelstrazSfu110f1ight5Darkne5Ss'
const REFRESH_TOKEN_SECRET = 'k0raelstrazSfu110f1ight5Darkne5Ss'

app.use(express.json());
app.use(cookieParser());
app.use(cors());

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

// авторизация 
app.post('/api/login', async (req, res) => {
  const { login, password } = req.body;
  try {
    const user = await User.findOne({ where: { login } });

    if (!user || !user.isActivated) {
      return res.status(401).json({ error: 'Invalid login or user not activated' });
    }

    if (await bcrypt.compare(password, user.password)) {
      // Generate tokens
      const accessToken = jwt.sign({ userId: user.id }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
      const refreshToken = jwt.sign({ userId: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: '60d' });

      // Set refresh token in httpOnly cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true, // Use true in production
        sameSite: 'strict',
        maxAge: 60 * 24 * 60 * 60 * 1000 // 60 days
      });

      return res.json({ accessToken });
    } else {
      return res.status(401).json({ error: 'Invalid login or password' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'User login failed' });
  }
});

// обновление токенов
app.post('/api/refresh-token', (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token not found' });
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const newAccessToken = jwt.sign({ userId: decoded.userId }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

    return res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// завершение сеанса (logout)
app.post('/api/logout', (req, res) => {
  res.cookie('refreshToken', '', { maxAge: 0 });
  res.status(200).json({ message: 'Logout successful' });
});

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
