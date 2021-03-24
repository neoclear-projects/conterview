const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	secureConnection: true,
	port: 465,
	secure: true,
	auth: {
		user: 'conterview.notification@gmail.com',
		pass: 'conterviewnewbee'
	}
});


function sendMail(to, subject, html){
	transporter.sendMail({
		from: 'Conterview',
		to,
		subject,
		html
	});
}

module.exports = sendMail;