'use strict';
const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'cfh.muse@gmail.com',
        pass: 'cfhandela'
    }
});
let link = document.URL

// setup email data with unicode symbols
let mailOptions = {
    from: 'cfh.muse@gmail.com', // sender address
    to: 'juliewanjamugira@gmail.com, fleviankanaiza@gmail.com', // list of receivers
    subject: 'Game Invite Link', // Subject line
    text: 'Hello dear?', link, // plain text body
    html: '<b>Hello dear?</b>', link // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
});
