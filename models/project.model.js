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
    
  }, 
  image_id:
  {
      type:String,
      required:true
  },
  image_link:
  {
      type:String,
      required:true,
  },
  status:
  {
      type:Boolean,
      required:true,
  }
});
const project = mongoose.model('projectdb',projectschema);
module.exports = project;