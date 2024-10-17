const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const verifierSchema = new Schema({
    email:{type:String,required:true,unique:true},
    fullnae:{type:String,required:true},
    username:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    approval:[{type:mongoose.Schema.Types.ObjectId, ref: 'Applications'}]
})

const Verifier = mongoose.model('verifiers',verifierSchema);

module.exports=Verifier;