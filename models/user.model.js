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
  },
  gitlink:
  {
      type: String,
  },
  user_image:
  {
    data: Buffer,
    contentType: String,
  },
  role:
  {
      type:String,
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