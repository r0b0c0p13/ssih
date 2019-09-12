var express         =  require("express"),
    app             =  express(),
    mongoose        =  require("mongoose"),
    bodyParser      =  require("body-parser"),
    passport        =  require("passport"),
    localStrategy   =  require("passport-local"),
    mailer          =  require("./mail.js");
    mongoose.connect("mongodb+srv://user:mongodbuser@cluster0-4p55w.mongodb.net/test?retryWrites=true&w=majority",{ useNewUrlParser: true });
    app.use(bodyParser.urlencoded({extended:true,}));
    app.set("view engine","ejs");
    app.use(express.static("public"));
    app.use(express.static(__dirname+ "/public"));
    /**************************************/

   /************************/
      var upload = require('express-fileupload');
      const http = require('http');
      var fs=require('fs');
      app.use(upload());
    
    /***********************/


    /************************/
      
    /***********************/
    
    
    
    var blogSchema =new mongoose.Schema({
        
    fname:String,
    lname:String,
    email:String,
    mobile:String,
    state:String,
    city:String,
    inquiry:String,
    department:String,
    subject:String,
    track_id:String,
    stat:[String],
    dept:[String],
    officer:[String],
    address:String,
    query:String
    
 });
   
   
   var Blog=mongoose.model("Blog",blogSchema);

   
// user schema
var passportLocalMongoose = require("passport-local-mongoose");
var UserSchema= new mongoose.Schema({
    
    username:String,
    department:String,
    password:String
});

UserSchema.plugin(passportLocalMongoose);
var User=mongoose.model("User",UserSchema);

   //PASSPORT CONFIGURATION 
  // ==============
  
  app.use(require("express-session")({
      secret:"once upon a time in ...",
      resave:false,
      saveUninitialized:false
  }));
  
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new localStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

   //to check currentuser
    app.use(function(req,res,next){
            res.locals.currentUser = req.user;
            next();
            });

// //========
app.get("/register",function(req,res){
          res.render("register");
     });



 
   
   app.get("/",function(req,res){
       res.render("log");
   });
   app.get("/newgre",function(req,res){
       res.render("submit_Gre");
       
   });
   
 app.get("/register_greivance",function(req,res){
       res.render("newfile");
       
   });
   

  //################################### track
  //track grievance
  
  app.post("/track_user",function(req, res){
         // var ide =req.body.track_id;
        Blog.find({},function(err,all){
        if(err){
            console.log("err");
          
        }
        else{
             for (var user of all){
                 if(user.track_id==req.body.track_id){
                     Blog.findById(user._id,function(err,found){
                         if(err){
                             console.log(err);
                         }
                         else{
                             
                             res.render("track_page",{found:found});
                         }
                     });
                 }
             }
             
        }
    });
       });  



app.get("/track",function(req, res) {
           res.render("user_track");
       });
       
       
//##########################################



  

     var rand,mailOptions,host,link;
   
   
       app.post("/subm",function(req,res){
       var email=req.body.email;
       console.log(email);
       rand=Math.floor((Math.random() * 100) + 54);
       host=req.get('host');
       link="http://"+req.get('host')+"/verify?id="+rand;
       
       
       var  to =email,
            subject ="Please confirm your Email account",
            html ="Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
              
       
        mailer.sendEmail(to,subject,html);
        res.render("verify");
       
   });
   
   
   //departmental signup
    //HANDLE signup logic

app.post("/register_user",function(req,res){
    var newUser = new User({username:req.body.username,department:req.body.department});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
           // req.flash("error",err.message);
            res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            //req.flash("success","successfully registered");
            res.redirect("/");
        });
    });
});

 app.get("/Departmental_login",function(req,res){
       res.render("Departmental_login");
       
   });
   
   
   
   //departmental login and logout
   
   app.post("/loginn", passport.authenticate("local",{successRedirect:"/all",failureRedirect:"/register"}),
               function(req,res){
           });
  
   app.get("/logout",isLoggedIn,function(req,res){
          req.logout();
              res.redirect("/");
     });
     
    
   
   
   
   app.get('/verify',function(req,res){
   console.log(req.protocol+"://"+req.get('host'));
   console.log("http://"+host+":80");
   
  //console.log(host);
  // console.log((req.protocol+"://"+req.get('host')));
   if((req.protocol+"://"+req.get('host'))==("http://"+host))
  {
      
      console.log("Domain is matched. Information is from Authentic email");
      if(req.query.id==rand)
    {   //console.log(rand);
        console.log("email is verified");
        res.redirect("/register_greivance");
    }
    else
    {
        console.log("email is not verified");
       
    }
  }
  else
  {
    res.send("<h1>Request is from unknown source");
  }
  });
   
   // raise a grievance
   
 app.post("/register",function(req,res){
       var ran=Math.floor((Math.random() * 999999) + 100007);
       var m  =new Blog;
       
           m.track_id="DIPP"+ran.toString();
           
           
          if(req.body.department=="other"){
                m.dept.push("other");
                m.officer.push("nodal_officer");
          }
          else{
                m.dept.push(req.body.department);
              if(req.body.department=="Finance")  m.officer.push("ab01");
             else if(req.body.department=="Science_and_Technology")  m.officer.push("ad01");
             else if(req.body.department=="Labour_and_Employment")  m.officer.push("ac01");
             else   m.officer.push("ae01");
          }
         
           
           m.fname=req.body.fname;
           m.lname=req.body.lname;
           m.email=req.body.email;
           m.mobile=req.body.mobile;
           m.address=req.body.address;
           m.state=req.body.state;
           m.city=req.body.city;
           m.department=req.body.department;
           m.subject=req.body.subject;
           m.inquiry=req.body.inquiry;
           m.stat.push("received");
           
            /************file management**************/
                console.log(req.files);
    if(req.files.upfile){
                var file = req.files.upfile,
                    name = file.name,
                    type = file.mimetype;
                var uploadpath = __dirname + '/uploads/' + name;
          
       file.mv(uploadpath,function(err){
      if(err){
        console.log("File Upload Failed",name,err);
        res.send("Error Occured!")
      }
      else {
        fs.rename(uploadpath, __dirname + '/newproj/v7/uploads/' + "DIPP"+ran.toString()+".pdf", function(err) {
          if ( err ) console.log('ERROR: ' + err);
      });
        console.log("File Uploaded",name);
       // res.send('Done! Uploading files')
       }
      });
   }
  else {
      res.send("No File selected !");
       res.end();
  };
           
           //****************************
           
           m.save(function(err,newly){
               if(err){
                   console.log("SOMETHING WENT WRONG");
               }
               else{
                   var  to =newly.email,
                              subject ="your request is successful",
                              html ="YOUR UNIQUE TRACK_ID IS :=: "+"DIPP"+ran.toString();
                              //console.log(to);
                              mailer.sendEmail(to,subject,html);
                             
                              const accountSid = 'ACe321f0ec084080df481ade57dc63d7c9';
                              const authToken = 'fd947fe8c1d2b8a6fd9428fd7c156171';
                              const client = require('twilio')(accountSid, authToken);
                              var mnum="+91"+newly.mobile;
                              client.messages
                              .create({
                                body: html,
                                from: '+12015146950',
                                to: mnum
                               });
                              res.redirect("/");
               }
           });
        });
           
   
   
   
   
  
   
   app.get("/all",function(req,res){
    Blog.find({}, function(err, griv) {
        if(err){
            console.log(err);
        }
       
     else  res.render("departmental_profile",{griv});
     
  });
       
   });
   
   
// view grievance
app.get("/:id",function(req, res) {
          Blog.findById(req.params.id,function(err,found){
                         if(err){
                             console.log(err);
                         }
                         else{
                             res.render("shows",{found:found});
                         }
                     });
          
       });
       



// forward to different dept
app.post("/forward/:id",function(req,res){
    Blog.findById(req.params.id,function(err,found){
        if(err){
            console.log(err);
        }
        else{
            found.query="---";
            found.dept.push(req.body.department);
            if(req.body.department=="Finance")  {found.officer.push("ab01");}
            else if(req.body.department=="Science_and_Technology") { found.officer.push("ad01");}
            else if(req.body.department=="Labour_and_Employment")  {found.officer.push("ac01");}
            else {  found.officer.push("ae01");}
           
            
            found.save(function(err,succ){
                if(err){
                    console.log("ho gya");
                }
                else{
                    var  to =found.email,
                              subject ="Update on grievance "+found.track_id,
                              html ="Your Grievance has been forwarded to "+req.body.department;
                              //console.log(to);
                              mailer.sendEmail(to,subject,html);
                              const accountSid = 'ACe321f0ec084080df481ade57dc63d7c9';
                              const authToken = 'fd947fe8c1d2b8a6fd9428fd7c156171';
                              const client = require('twilio')(accountSid, authToken);
                              var mnum="+91"+found.mobile;
                              client.messages
                              .create({
                                body: html,
                                from: '+12015146950',
                                to: mnum
                               });
                    
                    res.redirect("/all");
                }
            });
             
        }
    });
              
});


// same hierarchy transfer
app.post("/upward/:id",function(req,res){
    Blog.findById(req.params.id,function(err,found){
        if(err){
            console.log(err);
        }
        else{
            
            
            if(found.officer[(found.officer).length-1][3]=='4'){
            }
            else{
                found.dept.push(found.dept[(found.dept).length-1]);
               var t=found.officer[(found.officer).length-1];
               console.log(t);
                if(t[3]=='1'){
                    
                  t= t.substring(0, t.length - 1);
                  t=t+"2";
                  
                }
                 else if(t[3]=='2'){
                    
                    t= t.substring(0, t.length - 1);
                  t=t+"3";
                }
                else { t= t.substring(0, t.length - 1);
                  t=t+"4";}
                
                found.query="---";
                found.officer.push(t);
                console.log(t);
                found.save(function(err,succ){
                if(err){
                    console.log("ho gya");
                }
                else{
                    
                    res.redirect("/all");
                }
            });
               
            }
        }
    });
              
});

// accept grie
app.post("/accept/:id",function(req,res){
    Blog.findById(req.params.id,function(err,found){
        if(err){
            console.log(err);
        }
        else{found.query="---";
            
            found.dept.push("-Resolved-");
            found.officer.push("-Resolved-");
           
            
            found.save(function(err,succ){
                if(err){
                    console.log("ho gya");
                }
                else{
                    var  to =found.email,
                              subject ="Update on grievance "+found.track_id,
                              html ="Your Grievance has been resolved";
                              //console.log(to);
                              mailer.sendEmail(to,subject,html);
                             
                              const accountSid = 'ACe321f0ec084080df481ade57dc63d7c9';
                              const authToken = 'fd947fe8c1d2b8a6fd9428fd7c156171';
                              const client = require('twilio')(accountSid, authToken);
                              var mnum="+91"+found.mobile;
                              client.messages
                              .create({
                                body: html,
                                from: '+12015146950',
                                to: mnum
                               });
                    
                            res.redirect("/all");
                }
            });
             
        }
    });
              
});

// reject grie
app.post("/reject/:id",function(req,res){
    Blog.findById(req.params.id,function(err,found){
        if(err){
            console.log(err);
        }
        else{
            found.query="---";
            found.dept.push("-Rejected-");
            found.officer.push("-Rejected-");
              rejj=rejj+1;     
            
            found.save(function(err,succ){
                if(err){
                    console.log("ho gya");
                }
                else{
                    var  to =found.email,
                              subject ="Update on grievance "+found.track_id,
                              html ="Your Grievance has been rejected";
                              //console.log(to);
                              mailer.sendEmail(to,subject,html);
                             
                              const accountSid = 'ACe321f0ec084080df481ade57dc63d7c9';
                              const authToken = 'fd947fe8c1d2b8a6fd9428fd7c156171';
                              const client = require('twilio')(accountSid, authToken);
                              var mnum="+91"+found.mobile;
                              client.messages
                              .create({
                                body: html,
                                from: '+12015146950',
                                to: mnum
                               });
                    
                            res.redirect("/all");
                }
            });
             
        }
    });
              
});

app.get("/query/:id",function(req,res){
    
       res.render("enquiry_remaind",{ide:req.params.id});
       
   });
   
   
 app.post("/quer/:id",function(req,res){
    Blog.findById(req.params.id,function(err,found){
        if(err){
            console.log(err);
        }
        else{
            
            found.query=req.body.query;
         
                   
            
            found.save(function(err,succ){
                if(err){
                    console.log("ho gya");
                }
                else{
                    var  to =found.email,
                              subject ="Update on grievance "+found.track_id,
                              html ="query submitted";
                              //console.log(to);
                              mailer.sendEmail(to,subject,html);
                             
                              const accountSid = 'ACe321f0ec084080df481ade57dc63d7c9';
                              const authToken = 'fd947fe8c1d2b8a6fd9428fd7c156171';
                              const client = require('twilio')(accountSid, authToken);
                              var mnum="+91"+found.mobile;
                              client.messages
                              .create({
                                body: html,
                                from: '+12015146950',
                                to: mnum
                               });
                    
                            res.redirect("/");
                }
            });
             
        }
    });
              
});
  
   
   
   


  function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/Departmental_login");
}
   

  app.listen(process.env.PORT,process.env.IP,function(){
    console.log("app has started");
     });
     
     
