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

const project_get_details = (req,res) =>{
  const project_id = req.params.id;
  project_db.findById(project_id)
  .then(result => {
    res.render('gprojectdetails',{project:result});
  })
  .catch(err=>console.log(err));
}

module.exports = {
    project_get,
    project_get_details
}