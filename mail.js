var nodemailer=require('nodemailer');
module.exports={
    sendEmail: (to,subject,message) => {
    var mailOption ={
        from:'be10022.16@bitmesra.ac.in',
        to: to,
        subject : subject,
        text: message
    };
    var transport=nodemailer.createTransport({
        service:'gmail',
        auth: {
            user: "be10022.16@bitmesra.ac.in",
            pass: "*********"
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