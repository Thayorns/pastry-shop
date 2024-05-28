const express = require("express");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const { sequelize, User } = require('./models');
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.post('/api/register', async (req, res) => {
  const { login, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      login,
      password: hashedPassword,
      coffee_count: 0,
      friend: false
    });
    // console.log('New user created:', newUser);
    res.status(201).json(newUser);
  } catch (err) {
    // console.error(err);
    res.status(500).json({ error: 'User registration failed' });
  }
});

app.post('/api/login', async (req, res) => {
  const { login, password } = req.body;
  try {
    const user = await User.findOne({ where: { login } });
    if (user && await bcrypt.compare(password, user.password)) {
      res.status(200).json({ message: 'Login successful', user });
    } else {
      res.status(401).json({ error: 'Invalid login or password' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'User login failed' });
  }
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
