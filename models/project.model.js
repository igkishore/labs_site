const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const projectschema = new Schema({
  title:{
    type: String,
    required:true,
  },
  point1:
  {
    type:String,
    required:true,
  },
  point2:
  {
    type:String,
    required:true,
  },
  link1:
  {
    type:String,
    required:true,
  },
  link2:
  {
    type:String,
    required:true,
  },
  introduction:
  {
      type:String,
      required:true,
  },
  working:
  {
    type:String,
    required:true,
  },
  conclusion:
  {
    type:String,
    required:true,
  }, 
  project_image:
  {
    data: Buffer,
    contentType: String,
  },
  status:
  {
      type:Boolean,
      required:true,
  }
});
const project = mongoose.model('project',projectschema);
module.exports = project;