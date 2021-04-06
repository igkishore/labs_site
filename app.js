//Importings 
const express = require('express');
const mongoose = require('mongoose');
const bodyParser=require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const passport = require('passport'); 
const { ensureAuthenticated } = require('./auth');
require('./passport')(passport);
const flash = require('connect-flash');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const fs = require('fs')


//Express and port
var app = express();
const port = process.env.PORT || 3000 ;

//Database
const dburl = "mongodb+srv://gowtham:test1234@main.l0g6f.mongodb.net/labsite_db?retryWrites=true&w=majority";
mongoose.connect(dburl,{useNewUrlParser:true,useUnifiedTopology:true , useCreateIndex:true})
.then(res=> app.listen(port),console.log("Database  Connected !!!"))
.catch(err=> console.log(err));

//Database Models
const project_db = require('./models/project.model');
const blog_db = require('./models/blog.model');
const user_db = require('./models/user.model');

//View Engine
app.set('view engine','ejs');

//Multer
var path = require('path');
var multer = require('multer');
var image_file_name;
var storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads')
	},
	filename: (req, file, cb) => {
    image_file_name = uuidv4();
		cb(null, image_file_name)

	}
});
var upload = multer({ storage: storage });

//Static , Password , MiddleWare
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());
app.use(session({
  secret: 'gowtham',
  resave: true,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Routes
const projectroutes = require('./routes/projectroutes');
const blogroutes = require('./routes/blogroutes');
const memberroutes = require('./routes/memberroutes.js');













app.get('/logout',(req,res) =>{
  console.log('logout')
  req.logout();
  res.redirect('/');
})




//Central dashboard
app.get('/centraldashboard',ensureAuthenticated,(req,res)=>{
  console.log('Central Dashboard');
  res.render('centraldashboard',{error:''});
})








//Member Dashboard
app.get('/memberdashboard',ensureAuthenticated,(req,res) =>{
  console.log("Member dashboard");
  const user_id = req.session.passport.user;
  user_db.findById(user_id)
  .then(result => {
    if(result.role =='M')
    {
      res.render('membersdashboard',{user: result})
    }
    else
    {
      console.log("Member dashboard Un Authorized");
      res.render('centraldashboard',{error:'Un Authorized'})
    }
  })
  .catch(err=>console.log(err));
})

app.get('/membersaddproject',ensureAuthenticated,(req,res) =>{
  const user_id = req.session.passport.user;
  user_db.findById(user_id)
  .then(result => {
    if(result.role =='M')
    {
      res.render('memberaddproject')
    }
    else
    {
      console.log("Member Project Un Authorized");
      res.render('centraldashboard',{error:'Un Authorized'})
    }
  })
  .catch(err=>console.log(err));
 
})

app.post('/memberaddproject',ensureAuthenticated, upload.single('image'), (req,res) =>{
  const user_id = req.session.passport.user;
  user_db.findById(user_id)
  .then(result => {
    if(result.role =='M')
    {
      var obj = {
        title: req.body.title,
        point1: req.body.point1,
        point2: req.body.point2,
        link1: req.body.link1,
        link2:req.body.link2,
        introduction:req.body.introduction,
        working:req.body.working,
        conclusion:req.body.conclusion,
        status:1,
        project_image: {
          data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
          contentType: 'image/png'
        }
      }
      project_db.create(obj, (err, item) => {
        if (err) {
          res.render('admindashboard',{error:'Cannot add project'});
          console.log(err);
        }
        else {
           res.render('memberdashboard',{error:''});
        }
      });
    }
    else
    {
      res.render('centraldashboard',{error:'Un Authorized'})
    }
  })
  .catch(err=>console.log(err));
})


app.get('/membersaddblog',ensureAuthenticated,(req,res) =>{
  const user_id = req.session.passport.user;
  user_db.findById(user_id)
  .then(result => {
    if(result.role =='M')
    {
      res.render('memberaddblog')
    }
    else
    {
      console.log("Member Blog Un Authorized");
      res.render('centraldashboard',{error:'Un Authorized'})
    }
  })
  .catch(err=>console.log(err));
  
})

app.post('/memberaddblog',ensureAuthenticated,(req,res)=>{
  const user_id = req.session.passport.user;
  user_db.findById(user_id)
  .then(result => {
    if(result.role =='M')
    {
      var new_blog = {
        title:req.body.title,
        point1: req.body.point1,
        point2: req.body.point2,
        introduction:req.body.introduction,
        matter:req.body.matter,
        status:0
      }
      blog_db.create(new_blog, (err, item) => {
        if (err) {
          console.log(err);
        }
        else {
          res.redirect('/membersaddblog');
        }
      });
    }
    else
    {
      console.log("Member Add Blog Un Authorized");
      res.render('centraldashboard',{error:'Un Authorized'})
    }
  })
  .catch(err=>console.log(err));
})

app.get('/membersupdate',ensureAuthenticated,(req,res) =>{
  const user_id1 = req.session.passport.user;
  user_db.findById(user_id1)
  .then(result => {
    if(result.role =='M')
    {
      res.render('memberupdate',{member:result});
    }
    else
    {
      console.log("Member Update Un Authorized");
      res.render('centraldashboard',{error:'Un Authorized'})
    }
  })
  .catch(err=>console.log(err));

})



app.post('/memberupdate/:id',ensureAuthenticated, upload.single('image'),(req,res)=>{
  const member_id = req.params.id;
  const user_id = req.session.passport.user;
  if(user_id!=member_id)
  {
    console.log("Member Update Memberupdate Un Authorized");
    res.render('centraldashboard',{error:'Un Authorized'})
  }
  else
  {
    
    user_db.findOne({_id:member_id},(err,object)=>{
      if(err)
      {
        console.log(err);
      }
      else{
        if(!object)
        {
          res.status(404).send();
        }
        else{
          console.log(req);
          if(req.body.name)
          {
            object.name = req.body.name;
          }

          if(req.body.mail_id)
          {
            
            object.mail_id = req.body.mail_id;
          }

          if(req.body.gitlink)
          {
            object.gitlink = req.body.gitlink;
          }

          if(req.body.image)
          {
            /*object.user_image ={
              data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
              contentType: 'image/png'
            }*/
          }
          if(req.body.password1 && req.body.password2)
          {
            bcrypt.genSalt(10,(err,salt) =>
            bcrypt.hash(password1,salt,(err,hash) =>
            {
              if(err) throw err;
              object.password =hash;
                
            })
            )
          }
          object.save()
          .then(result =>{
            res.redirect('/logout');
          }) 
          .catch(err=>console.log(err));       
        }
      }
    })
  }
})


















//Admin Dashboard


//Ading Admin
app.get('/admindashboard',ensureAuthenticated,(req,res) =>{
  const user_id = req.session.passport.user;
  user_db.findById(user_id)
  .then(result => {
    if(result.role =='A')
    {
      res.render('admindashboard',{error:''});
    }
    else
    {
      res.render('centraldashboard',{error:'Un Authorized'})
    }
  })
  .catch(err=>console.log(err));
})

app.get('/adminaddproject',ensureAuthenticated,(req,res) =>{
  const user_id = req.session.passport.user;
  user_db.findById(user_id)
  .then(result => {
    if(result.role =='A')
    {
      res.render('adminaddproject')
    }
    else
    {
      res.render('centraldashboard',{error:'Un Authorized'})
    }
  })
  .catch(err=>console.log(err));
  
})

app.post('/adminaddproject',ensureAuthenticated, upload.single('image'), (req,res) =>{
  const user_id = req.session.passport.user;
  user_db.findById(user_id)
  .then(result => {
    if(result.role =='A')
    {
      var obj = {
        title: req.body.title,
        point1: req.body.point1,
        point2: req.body.point2,
        link1: req.body.link1,
        link2:req.body.link2,
        introduction:req.body.introduction,
        working:req.body.working,
        conclusion:req.body.conclusion,
        status:1,
        project_image: {
          data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
          contentType: 'image/png'
        }
      }
      project_db.create(obj, (err, item) => {
        if (err) {
          res.render('admindashboard',{error:'Cannot add project'});
          console.log(err);
        }
        else {
           res.render('admindashboard',{error:''});
        }
      });
    }
    else
    {
      res.render('centraldashboard',{error:'Un Authorized'})
    }
  })
  .catch(err=>console.log(err));
 })


app.get('/adminaddblog',ensureAuthenticated,(req,res) =>{
  const user_id = req.session.passport.user;
  user_db.findById(user_id)
  .then(result => {
    if(result.role =='A')
    {
      res.render('adminaddblog')
    }
    else
    {
      res.render('centraldashboard',{error:'Un Authorized'})
    }
  })
  .catch(err=>console.log(err));
  res.render('adminaddblog')
})



app.post('/adminaddblog',ensureAuthenticated,(req,res)=>{
  const user_id = req.session.passport.user;
  user_db.findById(user_id)
  .then(result => {
    if(result.role =='A')
    {
      var new_blog = {
        title:req.body.title,
        point1: req.body.point1,
        point2: req.body.point2,
        introduction:req.body.introduction,
        matter:req.body.matter,
        status:1
      }
      blog_db.create(new_blog, (err, item) => {
        if (err) {
          res.render('admindashboard',{error:'cannot add blog'});
          console.log(err);
        }
        else {
          res.render('admindashboard',{error:''});
        }
      });
    }
    else
    {
      res.render('centraldashboard',{error:'Un Authorized'})
    }
  })
  .catch(err=>console.log(err));
})



app.get('/adminaddmember',ensureAuthenticated,(req,res) =>{
  const user_id = req.session.passport.user;
  user_db.findById(user_id)
  .then(result => {
    if(result.role =='A')
    {
      res.render('adminaddmember')
    }
    else
    {
      res.render('centraldashboard',{error:'Un Authorized'})
    }
  })
  .catch(err=>console.log(err));
  
})

app.post('/adminaddmember',ensureAuthenticated, upload.single('image'),(req,res)=>{
  const user_id = req.session.passport.user;
  user_db.findById(user_id)
  .then(result => {
    if(result.role =='A')
    {
      const newuser = new user_db( {name:req.body.name ,role:"M", password:req.body.password});
      bcrypt.genSalt(10,(err,salt) =>
        bcrypt.hash(newuser.password,salt,(err,hash) =>
        {
          if(err) throw err;
          newuser.password =hash;
          newuser.save()
          .then(user =>
            {
              res.render('admindashboard',{error:''});
            })
          .catch(err => {
            console.log(err)
            res.render('admindashboard',{error:'cannot add member'});
          });
        })
      )
    }
    else
    {
      res.render('centraldashboard',{error:'Un Authorized'})
    }
  })
  .catch(err=>console.log(err));
   
})








//Admin edit


app.get('/admineditproject',ensureAuthenticated,(req,res) =>{
  const user_id = req.session.passport.user;
  user_db.findById(user_id)
  .then(result => {
    if(result.role =='A')
    {
      project_db.find().sort({createdAt:-1})
      .then(result =>{
        res.render('admineditprojects',{projects:result});
      })
      .catch(err => {
        console.log(err);
      })
    }
    else
    {
      res.render('centraldashboard',{error:'Un Authorized'})
    }
  })
  .catch(err=>console.log(err));

})

app.delete('/admineditproject/:id',ensureAuthenticated,(req,res)=>{
  const user_id = req.session.passport.user;
  user_db.findById(user_id)
  .then(result => {
    if(result.role =='A')
    {
      project_id = req.params.id;
      project_db.findByIdAndDelete(project_id)
      .then(result => {
        res.json({ redirect: '/admindashboard' });
      })
      .catch(err => {
        console.log(err);
      });
    }
    else
    {
      res.render('centraldashboard',{error:'Un Authorized'})
    }
  })
  .catch(err=>console.log(err));

})



app.get('/admineditblog',ensureAuthenticated,(req,res) =>{
  const user_id = req.session.passport.user;
  user_db.findById(user_id)
  .then(result => {
    if(result.role =='A')
    {
      blog_db.find().sort({createdAt:-1})
      .then(result =>{
        res.render('admineditblogs',{blogs:result});
      })
      .catch(err => {
        console.log(err);
      })
    }
    else
    {
      res.render('centraldashboard',{error:'Un Authorized'})
    }
  })
  .catch(err=>console.log(err));
})


app.delete('/admineditblog/:id',ensureAuthenticated,(req,res)=>{
  const user_id = req.session.passport.user;
  user_db.findById(user_id)
  .then(result => {
    if(result.role =='A')
    {
      blog_id = req.params.id;
      blog_db.findByIdAndDelete(blog_id)
      .then(result => {
        res.json({ redirect: '/admindashboard' });
      })
      .catch(err => {
        console.log(err);
      });
    }
    else
    {
      res.render('centraldashboard',{error:'Un Authorized'})
    }
  })
  .catch(err=>console.log(err));

})



app.get('/admineditmember',ensureAuthenticated,(req,res) =>{
  const user_id = req.session.passport.user;
  user_db.findById(user_id)
  .then(result => {
    if(result.role =='A')
    {
      user_db.find().sort({createdAt:-1})
      .then(result =>{
        res.render('admineditmembers',{members:result});
      })
      .catch(err => {
        console.log(err);
      })
    }
    else
    {
      res.render('centraldashboard',{error:'Un Authorized'})
    }
  })
  .catch(err=>console.log(err));
})

app.delete('/admineditmember/:id',ensureAuthenticated,(req,res)=>{
  const user_id = req.session.passport.user;
  user_db.findById(user_id)
  .then(result => {
    if(result.role =='A')
    {
      userdel_id = req.params.id;
      user_db.findByIdAndDelete(userdel_id)
      .then(result => {
        res.json({ redirect: '/admindashboard' });
      })
      .catch(err => {
        console.log(err);
      });
    }
    else
    {
      res.render('centraldashboard',{error:'Un Authorized'})
    }
  })
  .catch(err=>console.log(err));

})








//review

app.get('/adminreviewproject',ensureAuthenticated,(req,res) =>{
  const user_id = req.session.passport.user;
  user_db.findById(user_id)
  .then(result => {
    if(result.role =='A')
    {
      project_db.find().sort({createdAt:-1})
      .then(result =>{
        res.render('adminreviewproject',{projects:result});
      })
      .catch(err => {
        console.log(err);
      })
    }
    else
    {
      res.render('centraldashboard',{error:'Un Authorized'})
    }
  })
  .catch(err=>console.log(err));

})

app.get('/adminreviewprojectparticular/:id',ensureAuthenticated,(req,res)=>{
  const user_id = req.session.passport.user;
  user_db.findById(user_id)
  .then(result => {
    if(result.role =='A')
    {
      project_id=req.params.id;
      project_db.findById(project_id)
      .then(result =>{
        res.render('adminreviewprojectparticular',{project:result});
      })
      .catch(err => {
        console.log(err);
      })
    }
    else
    {
      res.render('centraldashboard',{error:'Un Authorized'})
    }
  })
  .catch(err=>console.log(err));
})

app.get('/adminreviewblog',(req,res) =>{
  const user_id = req.session.passport.user;
  user_db.findById(user_id)
  .then(result => {
    if(result.role =='A')
    {
      blog_db.find().sort({createdAt:-1})
      .then(result =>{
        res.render('adminreviewblog',{blogs:result});
      })
      .catch(err => {
        console.log(err);
      })
    }
    else
    {
      res.render('centraldashboard',{error:'Un Authorized'})
    }
  })
  .catch(err=>console.log(err));
})
























// Authentication
app.get('/login',(req,res)=>{
  const error = req.flash().error  || [];
  res.render('glogin',{error:error})
})

app.post('/login',(req,res,next) => {

    passport.authenticate('local',{

      successRedirect:'centraldashboard',
      failureRedirect:'login',
      failureFlash: 'Invalid Username or password'
    }) (req,res,next);
})


  app.get('/logout',(req,res) =>{
    req.logout();
    res.redirect('/');
  })

























//Index page

app.get('/',(req,res)=>{
  res.render('aaindex')
})

//project routes
app.use('/projects',projectroutes);

//blog routes
app.use('/blogs',blogroutes);

//member routes
app.use('/members',memberroutes);

//404 rout
app.use((req,res) =>{
  res.status(404).render('404');
})



























/*const express = require('express');
const mongoose = require('mongoose');
const bodyParser=require('body-parser');
const bcrypt = require('bcrypt');
const flash  =require('connect-flash');
const session = require('express-session');
const passport = require('passport'); 
const fs = require('fs');
require('./passport')(passport);

//File Requires

const { ensureAuthenticated } = require('./auth');
const blogRoutes = require('./routes/blogsroutes');
const projectRoutes = require('./routes/projectsroutes');
const userRoutes = require('./routes/memberroutes');

//Database Instances
const project_db = require('./models/project.model');
const blog_db = require('./models/blog.model');
const user_db = require('./models/user.model');


//Database Connections and Express
var app = express();
const port = process.env.PORT || 3000 ;
const dburl = "mongodb+srv://gowtham:test1234@main.l0g6f.mongodb.net/dataPirates_db?retryWrites=true&w=majority";
mongoose.connect(dburl,{useNewUrlParser:true,useUnifiedTopology:true})
.then(res=> app.listen(port),console.log("Database  Connected !!!"))
.catch(err=> console.log(err));

//View Engine


//Static and MiddleWare
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());
app.use(session({
  secret: 'gowtham',
  resave: true,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


//Multer
var path = require('path');
var multer = require('multer');

var storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads')
	},
	filename: (req, file, cb) => {
		cb(null, file.fieldname + '-' + Date.now())
	}
});

var upload = multer({ storage: storage });



//Main Route
app.get('/',(req,res)=>{
    res.render('aaindex');
    console.log('Rendered Index');
})

//Project Route
app.use('/projects',projectRoutes);
/*
//Memeber Route
app.use('/members',memberRoutes);

//Blog Route
app.use('/blogs',blogRoutes);

//404
app.use((req, res) => {
  res.status(404).render('404');
});




//Admin
//app.use('/admin',adminRoutes);

//Member
//app.use('/member',MemberRoutes);


//404 Page


/*
//admin
app.get('/adminlogin',(req,res)=>{
    res.render('adminlogin');
    console.log('adminRendered Login');
})

app.get('/adminregister',(req,res)=>{
    res.render('adminregister');
    console.log('Rendered adminRegister');
})

app.get('/admindashboard',(req,res)=>{
  res.render('admindashboard');
  console.log('Rendered admindashboard');
})

app.get('/editprojects',(req,res)=>{
  res.render('editprojects');
  console.log('Rendered Edit project')
})



app.get('/editmembers',(req,res)=>{
  res.render('editmembers');
  console.log('Rendered Edit members')
})

app.post('/al',(req,res,next)=>{
  passport.authenticate('local',{
    successRedirect:'admindashboard',
    failureRedirect:'adminlogin',
    failureFlash:true
  }) (req,res,next);
})

app.post('/ar',(req,res)=>{
  const {name,password} = req.body;
  const ps = new apdb({name,password});
  bcrypt.genSalt(10,(err,salt) =>
      bcrypt.hash(ps.password,salt,(err,hash) =>
      {
        if(err) throw err;
        ps.password =hash;
        ps.save()
        .then(user =>
          {
            res.redirect('/adminlogin')
          })
        .catch(err => console.log(err));
      })
    )
})

app.get('/logout',(req,res) =>{
  req.logout();
  res.redirect('adminlogin');
})


//projects
app.get('/projects',(req,res) =>{
    pjdb.find().sort({"created_at":  -1})
    .then(result =>{
      console.log(result)
      res.render('projects',{pj:result});
      console.log('projects rendered');
    })
    .catch(err => {
      console.log(err);
    })
})

app.get('/newproject',(req,res) =>{
 res.render('newproject');
 console.log('new project rendered')
})

app.post('/np', upload.single('image'), (req, res, next) => {
 console.log(req.body);
var obj = {
		title: req.body.title,
      point1: req.body.point1,
      point2: req.body.point2,
      link1: req.body.link1,
      link2: req.body.link2,
      introduction : req.body.introduction,
      working : req.body.working,
      conlcusion : req.body.conlcusion,
		  image: {
        data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
        contentType: 'image/png'
		  }
	}
  
	pjdb.create(obj, (err, item) => {
		if (err) {
			console.log(err);
		}
		else {
			res.redirect('/projects');
		}
	});
});







app.get('/projectdetail/:id',(req,res)=>{
  const id = req.params.id;
  pjdb.findById(id)
  .then(result =>{
   res.render('projectdetails',{pj : result});
  })
  .catch(err => {
    console.log(err);
  })
});




//members
app.get('/members',(req,res) =>{
  mbdb.find().sort({"created_at":  -1})
  .then(result =>{
    res.render('members',{mb:result});
    console.log('members rendered');
  })
  .catch(err => {
    console.log(err);
  })
})

app.get('/newmember',(req,res) =>{
res.render('newmember');
console.log('new member rendered')
});

app.post('/nm', (req, res) => {
const nmb = new mbdb(req.body);
nmb.save()
.then(result=> {
  res.redirect('members');
})
.catch(err=>{
  console.log(err);
})
});


app.get('/members/:id',(req,res)=>{
  const id = req.params.id;
  mbdb.findById(id)
  .then(result =>{
   res.render('memberdetails',{mb : result});
  })
  .catch(err => {
    console.log(err);
  })
});








//blogs 
app.get('/blogs',(req,res) =>{
    bgdb.find().sort({createdAt: -1})
    .then(result =>{
      res.render('blogs',{bg:result});
    })
    .catch(err => {
      console.log(err);
    })
});

app.get('/newblog',(req,res)=>
{
    res.render('newblog');
    console.log('new blog Rendered');
});

app.post('/nb',(req,res)=>
{
   const bg = new bgdb(req.body);
   bg.save()
   .then(result=>{
       res.redirect('blogs');
   })
   .catch(err=>{
       console.log(err);
   })
})

app.get('/blogdetail/:id',(req,res) =>
{
  const id = req.params.id;
  bgdb.findById(id)
  .then(result =>{
   res.render('blogdetails',{bgs : result});
  })
  .catch(err => {
    console.log(err);
  })
})

app.get('/editblogs',(req,res) =>{
  bgdb.find().sort({createdAt: -1})
  .then(result =>{
    res.render('editblogs',{bgs:result});
  })
  .catch(err => {
    console.log(err);
  })
});*/