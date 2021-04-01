const express = require('express');
const mongoose = require('mongoose');
const bodyParser=require('body-parser');
const bcrypt = require('bcrypt');
const flash  =require('connect-flash');
const session = require('express-session');
const passport = require('passport'); 
const fs = require('fs');
var app = express();

//File Requires
require('./passport')(passport);
const { ensureAuthenticated } = require('./auth');
const blogRoutes = require('./routes/blogsroutes');
const projectRoutes = require('./routes/projectsroutes');
const memberRoutes = require('./routes/memberroutes');
//const adminRoutes = require('./routes/adminroutes')
//const MemberRoutes = require('./routes/membersroutes');

//Database Instances
const pjdb = require('./models/project.model');
const bgdb = require('./models/blog.model');
const mbdb = require('./models/member.model');
const apdb = require('./models/user.model');


//Database Connections
const port = process.env.PORT || 3000 ;
const dburl = "mongodb+srv://gowtham:test1234@main.l0g6f.mongodb.net/dataPirates_db?retryWrites=true&w=majority";
mongoose.connect(dburl,{useNewUrlParser:true,useUnifiedTopology:true})
.then(res=> app.listen(port),console.log("Database  Connected !!!"))
.catch(err=> console.log(err));

//View Engine
app.set('view engine','ejs');

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
const auth = require('./auth');

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