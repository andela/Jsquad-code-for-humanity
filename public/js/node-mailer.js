const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'cfh.muse@gmail.com',
    pass: 'cfhandela'
  }
});

// setup email data with unicode symbols
const mailOptions = {
  from: '"CFH 👻" <info@gmail.com.com>', // sender address
  to: 'flevian.kanaiza@andela.com, fleviankanaiza@gmail.com', // list of receivers
  subject: 'Hello ✔', // Subject line
  text: 'http://localhost:3000/#!/app?game=x4A5xS', // plain text body
  html: '<b>http://localhost:3000/#!/app?game=x4A5xS</b>' // html body
};

// send mail with defined transpnort object
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    //return console.log(error);
  }
  //console.log('Message %s sent: %s', info.messageId, info.response);
});
