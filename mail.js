var nodemailer=require('nodemailer');
module.exports={
    sendEmail: (to,subject,message) => {
    var mailOption ={
        from:'dodrairob@gmail.com',
        to: to,
        subject : subject,
        text: message
    };
    var transport=nodemailer.createTransport({
        service:'gmail',
        auth: {
            user: "dodrairob@gmail.com",
            pass: "8252501319"
        }
    });
    transport.sendMail(mailOption,function (err,info){
        if(err){
            console.log(err);
        }else{
            console.log('Email sent:'+info.response);
        }
    });
}
}
