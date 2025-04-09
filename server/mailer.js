const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'creamkorzh@gmail.com',
        pass: 'uaix vtsr hxwe uohy',
    },
});

module.exports = transporter;