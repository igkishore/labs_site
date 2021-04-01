//Importings 
const express = require('express');
const mongoose = require('mongoose');
const bodyParser=require('body-parser');
const { v4: uuidv4 } = require('uuid');

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
var pdf_file_name;
var storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads')
	},
	filename: (req, file, cb) => {
    pdf_file_name = uuidv4() + '.pdf' ;
		cb(null, pdf_file_name)

	}
});
var upload = multer({ storage: storage });

//Static , Password , MiddleWare
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());

//Routes
const projectroutes = require('./routes/projectroutes');
const blogroutes = require('./routes/blogroutes');
const memberroutes = require('./routes/memberroutes.js');


//Member Dashboard
app.get('/memberdashboard',(req,res) =>{
  res.render('membersdashboard')
})

app.get('/membersaddproject',(req,res) =>{
  res.render('membersnewproject')
})

app.get('/membersaddblog',(req,res) =>{
  res.render('membersnewblog')
})

app.get('/membersupdate',(req,res) =>{
  res.render('membersupdate')
})

//Admin Dashboard
app.get('/admindashboard',(req,res) =>{
  res.render('admindashboard')
})

app.get('/adminaddproject',(req,res) =>{
  res.render('adminaddproject')
})

app.get('/adminaddblog',(req,res) =>{
  res.render('adminaddblog')
})


app.get('/adminaddmember',(req,res) =>{
  res.render('adminaddmember')
})



app.get('/admineditproject',(req,res) =>{
  res.render('admineditproject')
})

app.get('/admineditblog',(req,res) =>{
  res.render('admineditblog')
})

app.get('/admineditmember',(req,res) =>{
  res.render('admineditmember')
})



app.get('/adminreviewproject',(req,res) =>{
  res.render('adminreviewproject')
})

app.get('/adminreviewblog',(req,res) =>{
  res.render('adminreviewblog')
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