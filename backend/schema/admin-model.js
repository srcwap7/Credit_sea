const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminschema = new Schema({
    email:{type:String,required:true,unique:true},
    username:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    fullname:{type:String,required:true}
})

const Admin = mongoose.model('admin',adminschema);

module.exports=Admin