const { model } = require('mongoose');
const blog_db = require('../models/blog.model');


const blog_get = (req,res) => {
  blog_db.find().sort({createdAt:-1})
  .then(result =>{
    res.render('blogs',{blogs :result});
  })
  .catch(err => {
    console.log(err);
  })
}

const blog_details_get = (req,res) =>{
    const id = req.params.id;
    blog_db.findById(id)
    .then(result =>{
     res.render('blogdetails',{blog : result});
    })
    .catch(err => {
      console.log(err);
    })
}

module.exports = {
    blog_get,
    blog_details_get
}