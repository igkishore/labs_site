const mongoose = require('mongoose');
const schema = mongoose.Schema;

const membersschema = new schema({
    memname:
    {
        type:String,
        required:true,
    },
    gitlink:
    {
        type: String,
        required:true,
    },
    mailid:
    {
        type: String,
        required:true,
    },
    image:
    {
    data: Buffer,
    contentType: String,
    },
});
const member = mongoose.model('blogdb',membersschema);
module.exports = member;