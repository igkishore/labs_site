const { model } = require('mongoose');
//const project_db = require('../models/project.model');


const admin_dashboard_get = (req,res) => {
  res.render('admindashboard');
}

const admin_reviewproject_get = (req,res)=>{
  res.render('reviewproject');
}

const admin_reviewblog_get = (req,res)=>{
  res.render('reviewblog');
}

const admin_reviewmember_get = (req,res) =>{
  res.render('reviewmember');
}

const admin_addproject_get = (req,res) =>{
  res.render('addproject');
}

const admin_addblog_get = (req,res) =>{
  res.render('addblog');
}

const admin_addmember_get = (req,res) =>{
  res.render('addmember');
}

const admin_editprojects_get = (req,res) =>{
  res.render('editproject');
}

const admin_editblogs_get = (req,res) =>{
  res.render('editblogs');
}



module.exports = {
    admin_dashboard_get,
    admin_addproject_get,
    admin_addblog_get,
    admin_addmember_get,
    admin_editprojects_get,
    admin_editblogs_get,
    admin_reviewproject_get,
    admin_reviewblog_get,
    admin_reviewmember_get
}
