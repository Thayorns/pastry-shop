const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'creamkorzh@gmail.com',
        // pass: 'dusa ytdy ewyv ngml',
        pass: 'uaix vtsr hxwe uohy',
    },
});

module.exports = transporter;