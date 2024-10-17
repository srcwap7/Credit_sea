const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    email:{type:String,unique:true,match:[/.+@.+\..+/,"Please Enter a valid Mail Address"]},
    token:{type:String},
    createdAt:{type:Date,default:Date.now,index:{expires:'5m'}},
    expiration:{type:Number,default:300}
})

const token = mongoose.model('token',tokenSchema);
module.exports=token;