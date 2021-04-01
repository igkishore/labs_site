const { model } = require('mongoose');
const project_db = require('../models/project.model');


const project_get = (req,res) => {
  project_db.find().sort({createdAt:-1})
  .then(result =>{
    res.render('g.projects',{projects :result});
  })
  .catch(err => {
    console.log(err);
  })
}

const project_details_get = (req,res) =>{
    const id = req.params.id;
    pjdb.findById(id)
    .then(result =>{
     res.render('g.projectdetails',{project : result});
    })
    .catch(err => {
      console.log(err);
    })
}

module.exports = {
    project_get,
    project_details_get
}
