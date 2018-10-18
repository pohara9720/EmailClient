const express = require("express");
const bodyParser = require("body-parser")
const app = express()
const logger = require('morgan')
const cors = require('cors')
const nodemailer = require('nodemailer')
var port = process.env.PORT || 9000




app.use(logger("dev"))
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.text())
app.use(bodyParser.json({ type: "application/vnd.api+json" }))
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Authorization,Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
//and remove cacheing so we get the most recent comments
  res.setHeader("Cache-Control", "no-cache");
  next();
});


	 const sendEmail = (sender,name,address,subject,html) => {
		const mailOptions = { from: `${sender.name} <${sender.email}>`, to: address,subject,html } 
		console.log('mailOptions',mailOptions)
		transporter.sendMail(mailOptions, (error, info) => {
	        if (error) {
	            res.send(error)
	        }
	        console.log('Message sent',info)
	        res.send(info)
	    });
	}

	const spamEverybody = (sender,array) => {
		for(let i = 0; i < array.length; i++){
			const r = array[i]
			const subject = 'Why dont you have Openpay?'
			const html = `<p>Hi ${r.name} I am just curious why you dont have Openpay as a payment option?!</p>`
			sendEmail(sender,r.name,r.email,subject,html)
		}
		
	}


app.get('/',(req,res) => {
	res.send('Running')
})


app.post('/spam',(req,res) => {
	const user = req.body.user
	const retailers = req.body.retailers
	const email = req.body.email

	let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
	    port: 465,
	    secure: true,
        auth: {
            user: user.email, // generated ethereal user
            pass: user.password // generated ethereal password
        }
    })

	retailers.map((r,i,a) => {
		if(i === a.length -1){
			const mailOptions = { 
		    	from: `${user.name} <${user.email}>`,
		    	to: r.email,
		    	subject:email.subject,
		    	html:`<p>Hello ${r.display}, ${email.message}</p>` 
	    	} 
			transporter.sendMail(mailOptions, (error, info) => {
		        if (error) {
		            res.send(error)
		        }
		        console.log('Message sent',info)
		        	res.send(info)
		    });
		}else{
			const mailOptions = { 
		    	from: `${user.name} <${user.email}>`,
		    	to: r.email,
		    	subject:email.subject,
		    	html:`<p>Hello ${r.display}, ${email.message}</p>` 
		    } 
			transporter.sendMail(mailOptions, (error, info) => {
		        if (error) {
		            res.send(error)
		        }
		        console.log('Message sent',info)
		        res.sendStatus(200)
		    });
		}
	})

})



 app.listen(port, function() {
    console.log("App listening on PORT " + port);
})