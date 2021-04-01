const { model } = require('mongoose');
const members_db = require('../models/member.model');


const member_get = (req,res) => {
  members_db.find().sort({createdAt:-1})
  .then(result =>{
    res.render('g.members',{members :result});
  })
  .catch(err => {
    console.log(err);
  })
}

module.exports = {
    member_get
}