const mongoose = require('mongoose');
const schema = mongoose.Schema;

const blogschema = new schema({
    title:
    {
        type:String,
        required:true,
    },
    point1:
    {
        type: String,
        required:true,
    },
    point2:
    {
        type: String,
        required:true,
    },
    introduction:
    {
        type: String,
        required:true,
    },
    matter: 
    {
        type: String,
        required:true,
    },
    status:
    {
        type:Boolean,
        required:true,
    }
});
const blog = mongoose.model('blog_db',blogschema);
module.exports = blog;