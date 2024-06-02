const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'thayornswordsman@gmail.com',
        pass: 'dusa ytdy ewyv ngml',
    },
});

module.exports = transporter;