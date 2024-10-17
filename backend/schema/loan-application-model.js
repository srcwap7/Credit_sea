const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const loanApplicationSchema = new Schema({
    fullname:{type:String,required:true},
    amount:{type:Number,required:true},
    tenure:{type:Number,required:true},
    empstatus:{type:String,required:true},
    empaddress:{type:String,required:true},
    purpose:{type:String,required:true},
    status:{type:String,required:true,default:"pending"},
    appliedAt:{type:Date,default:Date.now},
    applicantId:{type:String,required:true}
});

const loan = mongoose.model('loans',loanApplicationSchema);

module.exports = loan;