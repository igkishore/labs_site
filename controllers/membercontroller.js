const user_db = require('../models/user.model');


const members_get = (req,res) =>{
    user_db.find().sort({createdAt:-1})
    .then(result =>{
      res.render('gmembers',{members:result});
    })
    .catch(err => {
      console.log(err);
    })
}

module.exports = {
    members_get,
}