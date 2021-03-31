const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userschema = new Schema({
  name:{
    type: String,
    required:true,
    unique:true,
  },
  role:
  {
    type: String,
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