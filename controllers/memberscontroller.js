const { model } = require('mongoose');


const member_dashboard_get = (req,res) =>{
    res.render('memberdashboard')
}

const member_addblog_get = (req,res) =>{
    res.render('memberaddblog');
}

const member_addproject_get = (req,res) =>{
    res.render('memberaddproject');
}

module.exports = {
    member_dashboard_get,
    member_addproject_get,
    member_addblog_get
}