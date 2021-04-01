const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userschema = new Schema({
  name:{
    type: String,
    required:true,
    unique:true,
  },
  mail_id:
  {
    type: String,
    required:true,
  },
  gitlink:
  {
      type: String,
      required:true,
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
  },
  password:
  {
    type:String,
    required:true,
  }
});
const user = mongoose.model('user',userschema);
module.exports = user;