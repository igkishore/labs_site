const project_db = require('../models/project.model');


const project_get = (req,res) =>{
    project_db.find().sort({createdAt:-1})
    .then(result =>{
      res.render('gprojects',{projects:result});
    })
    .catch(err => {
      console.log(err);
    })
}

module.exports = {
    project_get,
}