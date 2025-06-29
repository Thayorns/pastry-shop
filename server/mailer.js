const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your_email', /* type your email here */
        pass: 'your_auth_pass', /* type your email auth pass */
    },
});

module.exports = transporter;