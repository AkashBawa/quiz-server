const nodeMailer = require('nodemailer');

const transporter = nodeMailer.createTransport({
    service : 'gmail',
    auth: {
        user : "bawa2027@gmail.com",
        pass :'awab2027'
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