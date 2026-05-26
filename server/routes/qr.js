const express = require('express');
const QRCode = require('qrcode');
const { User } = require('../models');

const router = express.Router();

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

router.post('/qr', async (req, res) => {
  const { login } = req.body;

  try {
    const user = await User.findOne({ where: { login } });

    const randomNumber = getRandomArbitrary(1000, 10000);
    const qrCodeDataURL = await QRCode.toDataURL(randomNumber.toString());

    user.qr_code = randomNumber;
    await user.save();

    res.json({ number: randomNumber, qrCode: qrCodeDataURL });

    setTimeout(async () => {
      if (user.qr_code !== null) {
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

module.exports = router;
