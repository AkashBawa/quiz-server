const nodeMailer = require('nodemailer');
if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const transporter = nodeMailer.createTransport({
    service : 'gmail',
    auth: {
        user : process.env.EMAIL,
        pass : process.env.PASSWORD
    }
})

module.exports.sendMail= async(to, subject, data)=>{
    console.log("send mail")
    let mailOption = {
        from: 'bawa2027@gmail.com',
        to: to,
        subject: subject,
        html: data
    }
    transporter.sendMail(mailOption, function(err, result){
        if(err){
            console.log(err)
        } else {
            console.log("mail sent ", result)
        }
    })
}