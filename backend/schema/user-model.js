const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    googleId:{type:String,default:null},
    email:{type:String,required:true,unique:true,match:[/.+@.+\..+/,"Please Enter a Valid Mail Address"]},
    username:{type:String,required:true},
    password:{type:String,required:true},
    createdAt:{type:Date,default:Date.now},
    applications:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Applications' }]
});

const User = mongoose.model('user',userSchema);

module.exports = User;

