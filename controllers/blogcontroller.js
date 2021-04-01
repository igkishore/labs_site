const blog_db = require('../models/blog.model');


const blogs_get = (req,res) =>{
    blog_db.find().sort({createdAt:-1})
    .then(result =>{
      res.render('gblogs',{blogs:result});
    })
    .catch(err => {
      console.log(err);
    })
}
const blogs_get_details = (req,res) =>{
    blog_db.find().sort({createdAt:-1})
    .then(result =>{
      res.render('gblogdetails',{blog:result});
    })
    .catch(err => {
      console.log(err);
    })
}

module.exports = {
    blogs_get,
    blogs_get_details
}