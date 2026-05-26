const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const transporter = require('../mailer');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, login, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { login } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, login, password: hashedPassword });

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const activationLink = `${process.env.DOMAIN}/api/activate/${token}`;

    const mailOptions = {
      from: 'thayornswordsman@gmail.com',
      to: email,
      subject: 'Account activation',
      html: `<p>Follow the link <a href="${activationLink}">Claude Code</a> to activate your account.</p>`
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'User registered, activation email sent' });
  } catch (err) {
    console.error('Registration error details:', err);
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
});

router.get('/activate/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ where: { id: decoded.id } });

    if (!user) {
      return res.status(400).json({ error: 'Invalid token or user not found' });
    }

    user.isActivated = true;
    await user.save();

    res.redirect(`${process.env.ALLOWED_ORIGINS}/activate/${token}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Account activation failed' });
  }
});

router.post('/login', async (req, res) => {
  const { login, password } = req.body;

  try {
    const user = await User.findOne({ where: { login } });

    if (!user || !user.isActivated) {
      return res.status(401).json({ error: 'Invalid login or user not activated' });
    }

    if (await bcrypt.compare(password, user.password)) {
      const accessToken = jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
      const refreshToken = jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '60d' });

      user.refresh_token = refreshToken;
      await user.save();

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 24 * 60 * 60 * 1000
      });

      return res.json({ accessToken, login, role: user.admin, friend: user.friend });
    } else {
      return res.status(401).json({ error: 'Invalid login or password' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'User login failed' });
  }
});

router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token not found' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findOne({ where: { id: decoded.userId, refresh_token: refreshToken } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid refresh token or user not found' });
    }

    const newAccessToken = jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

    return res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
});

router.post('/logout', (req, res) => {
  res.cookie('refreshToken', '', { maxAge: 0 });
  return res.status(200).json({ message: 'Logout successful' });
});

module.exports = router;
