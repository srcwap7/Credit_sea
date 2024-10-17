const express=require('express');
const passport=require('./passport')
const nodemailer=require('nodemailer');
const authRoute=require('./routes/authRoutes');
const {google} = require('googleapis');
const Token = require('./schema/token-model');
const crypto = require('crypto');
const cors = require('cors');
const User = require('./schema/user-model');
const Loan = require('./schema/loan-application-model');
const Verifier = require('./schema/verifier-model.js');
const Admin = require('./schema/admin-model.js')

require('dotenv').config({path:'./config.env'});

const OAuth2 = google.auth.OAuth2;
const app=express();


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    type: "OAuth2",
    clientId:process.env.SHIV_CLIENT_ID,
    clientSecret:process.env.SHIV_CLIENT_SECRET,
  }
});


app.use('/auth',authRoute);
app.use(express.json());
app.use(cors());


app.get('/',(req,res)=>{
    res.send("Welcome to the dummy login!");
})

app.post("/sendEmail",async(req,res)=>{
  const { to } = req.body;
  if (!to) {
    return res.status(400).json({ error: "Missing required fields: 'to'" });
  }
  try{
    //Generate a 6 digit token
    const token = crypto.randomInt(100000, 999999).toString();
    const newToken = new Token({ email: to, token });
    
    await newToken.save();

    const isSuccess = await new Promise( (resolve,reject)=>{
      transporter.sendMail({
        from:process.env.GMAIL_USER,
        to: to,
        subject: "OTP Verification Code",
        text: `Your OTP verification code is:- ${token}`,
        auth: {
          user:process.env.GMAIL_USER,
          refreshToken:process.env.SHIV_REFRESH_TOKEN,
          accessToken:process.env.SHIV_ACCESS_TOKEN
        }
      },(error,info)=>{
        if (error){
          console.log("Error Encountered: " + error);
          reject();
        }
        else resolve(1);
      });
    })

    res.status(200).json({message:"Email Sent Successfully"});
  }
  catch(error){
    console.log(error);
    res.status(500).json({message:"Failed to send email"});
  }
});

app.post("/verifyToken",async(req,res)=>{
  console.log("API request received");
  const {email,token} = req.body;
  if (!email || !token) res.status(500).json("Invalid Operation");
  const findElement = await Token.findOne({email:email,token:token});
  if (findElement){
    console.log("OTP Matched Successfully");
    await Token.deleteOne({email:email,token:token});
    res.status(200).json("Good To Go!");
  }
  else{
    res.status(201).json("OTP Not matched");
  }
})

app.post("/completeProfile",async(req,res)=>{
  const {username,email,password} = req.body;
  console.log(username);
  if (!username || !email || !password) res.status(500).json({message:"Missing Parameters"});
  try{
    const hashPassword = crypto.createHash("sha256").update(password).digest("hex");
    const newUser = new User({email:email,username:username,password:hashPassword});
    const savedId = await newUser.save();
    console.log(savedId);
    const userId = savedId._id;
    res.status(200).json({message:"Good To Go",userId:userId}); 
  }
  catch(error){
    console.log(error);
    res.status(500).json({message:"May be try a different Username or Password or May Be you already have an account"});
  }
})


app.post("/login",async(req,res)=>{
  console.log("Received API request");
  const {email,password} = req.body;
  if (!email || !password) res.status(500).json({messsage:"Missing Parameters"});
  try{
    const hashPassword = crypto.createHash("sha256").update(password).digest("hex");
    const findUser = await User.findOne({email:email,password:hashPassword});
    if (findUser){
      console.log(findUser);
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        username: findUser.username,
        userId: findUser._id
      });
    }
    else{
      console.log("Invalid Credentials!");
      res.status(201).json({message:"Bad Credentials"});
    }
  }
  catch(error){
    res.status(500).json({message:"Unexpected Error!"});
  }
})

app.post("/gethomepage",async(req,res)=>{
  const {userId} = req.body;
  if (!userId) res.status(201).json({message:"Invalid Credentials"});
  else{
    try{
      const user = await User.findOne({_id:userId});
      loanapplications = [];
      if (user){
        for (let i=0;i<user.applications.length;i++){
          const loanid = user.applications[i];
          const loan = await Loan.findOne({_id:loanid});
          loanapplications.push(loan);
        }
        res.status(200).json({message:"Ok",loanApplications:loanapplications});
      }
      else res.status(201).json({message:"User Not Found"});
    }
    catch(error){
      res.status(500).json({message:"Unexpected Error"});
      console.log(error);
    }
  }
})


app.post("/applyforloan", async (req, res) => {
  console.log("API request received!");
  const { fullname, amount, tenure, empstatus, empaddress, purpose, applicantId } = req.body;

  try {
    // Create a new loan application
    const newApplication = new Loan({
      fullname,
      amount,
      tenure,
      empstatus,
      empaddress,
      purpose,
      applicantId,
    });
    const savedLoan = await newApplication.save();
    const applicant = await User.findById(applicantId);
    if (!applicant) {
      return res.status(404).json({ message: "Applicant not found" });
    }
    const result = await Verifier.aggregate([
      {
        $project: {
          _id: 1,
          approvalSize: { $size: "$approval" }
        }
      },
      { $sort: { approvalSize: 1 } },
      { $limit: 1 }
    ]);
    if (result.length === 0) {
      return res.status(404).json({ message: "No verifiers available." });
    }
    const desiredId = result[0]._id;
    const verifier = await Verifier.findById(desiredId);
    if (!verifier) {
      return res.status(404).json({ message: "Verifier not found." });
    }
    verifier.approval.push(savedLoan._id);

    applicant.applications.push(savedLoan._id);
    await verifier.save();
    await applicant.save();

    res.status(200).json({ message: "Loan Application Successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unexpected Error" });
  }
});

app.post("/viewapplication",async(req,res)=>{
  const {applicationId} = req.body;
  if (!applicationId) res.status(500).json({message:"Invalid Parameter"});
  try{
    const application = await Loan.findOne({_id:applicationId});
    if (application){
      res.status(200).json({message:application});
    }
    else res.status(201).json({message:"Not Found"});
  }
  catch(error){
    res.status(500).json({message:"Unexpected Error"});
  }
})


app.post("/loginverifier",async(req,res)=>{
  console.log("Received API request");
  const {email,password} = req.body;
  if (!email || !password) res.status(500).json({messsage:"Missing Parameters"});
  else{
    try{
      const hashPassword = crypto.createHash("sha256").update(password).digest("hex");
      const findVerifier = await Verifier.findOne({email:email,password:hashPassword});
      if (findVerifier){
        console.log(findVerifier);
        return res.status(200).json({
          success: true,
          message: 'Login successful',
          userId: findVerifier._id
        });
      }
      else{
        console.log("Invalid Credentials!");
        res.status(500).json({message:"Bad Credentials"});
      }
    }
    catch(error){
      res.status(500).json({message:"Unexpected Error!"});
      console.log(error);
    }
  }
})

app.post('/verifierhomepage',async(req,res)=>{
  console.log("Received API request");
  const {verifierId} = req.body;
  if (!verifierId) res.status(500).json({message:"Missing paramters"});
  else{
    try{
      loanassigned = []
      const verifier = await Verifier.findOne({_id:verifierId});
      const loansarray = verifier.approval;
      for (let i=0;i<loansarray.length;i++){
        const loan = await Loan.findOne({_id:loansarray[i]});
        loanassigned.push(loan);
      }
      res.status(200).json({message:"Good To Go",approval:loanassigned});
    }
    catch(error){
      res.status(500).json({message:"Unexpected Error"});
      console.log(error);
    }
  }
});

app.post("/approveloan",async(req,res)=>{
  console.log("Received API request");
  const {applicationId} = req.body;
  if (!applicationId) res.status(500).json({message:"Missing Parameters"});
  else{
    try{
      const application = await Loan.findOne({_id:applicationId});
      application.status="approved";
      application.save();
      res.status(200).json({message:"Good To Go!"});
    }
    catch(error){
      res.status(500).json({message:"Unexpected Error"});
    }
  }
})

app.post("/rejectloan",async(req,res)=>{
  console.log("Received API request");
  const {applicationId} = req.body;
  if (!applicationId) res.status(500).json({message:"Missing Parameters"});
  else{
    try{
      const application = await Loan.findOne({_id:applicationId});
      application.status="rejected";
      application.save();
      res.status(200).json({message:"Good To Go!"});
    }
    catch(error){
      res.status(500).json({message:"Unexpected Error"});
    }
  }
})

app.post("/verifyloan",async(req,res)=>{
  console.log("Received API request");
  const {applicationId} = req.body;
  if (!applicationId) res.status(500).json({message:"Missing Parameters"});
  else{
    try{
      const application = await Loan.findOne({_id:applicationId});
      application.status="verified";
      await application.save();
      res.status(200).json({message:"Good To Go!"});
    }
    catch(error){
      res.status(500).json({message:"Unexpected Error"});
      console.log(error);
    }
  }
})


app.post("/addverifier",async(req,res)=>{
  console.log("Received API request");
  const {email,username,password,fullname} = req.body;
  if (!email || !username || !password || !fullname) res.status(500).json({message:"Missing Parameters"});
  else{
    try{
      const hashedPassword = crypto.createHash('sha256').update(password).digest("hex");
      const newVerifier = new Verifier({
        email:email,
        username:username,
        password:hashedPassword,
        fullnae:fullname
      })
      await newVerifier.save();
      res.status(200).json({message:"Good To Go!"});
    }
    catch(error){
      console.log(error);
      res.status(500).json({message:"Unexpected Error"});
    }
  }
})

app.post("/removeverifier",async(req,res)=>{
  console.log("Received API request");
  const {verifierId} = req.body;
  if (!verifierId) res.status(500).json({message:"Missing Parameters"});
  else{
    try{
      await Verifier.deleteOne({_id:verifierId});
      res.status(200).json({message:"Good To Go!"});
    }
    catch(error){
      console.log(error);
      res.status(500).json({message:"Unexpected Error"});
    }
  }
})

app.post("/addadmin",async(req,res)=>{
  console.log("Received API request");
  const {username,email,password,fullname} = req.body;
  if (!email || !username || !password || !fullname) res.status(500).json({message:"Missing Parameters"});
  else{
    try{
      const hashedPassword = crypto.createHash('sha256').update(password).digest("hex");
      const newAdmin = new Admin({
        email:email,
        username:username,
        password:hashedPassword,
        fullname:fullname
      })
      await newAdmin.save();
      res.status(200).json({message:"Good To Go!"});
    }
    catch(error){
      console.log(error);
      res.status(500).json({message:"Unexpected Error"});
    }
  }
})

app.post("/removeadmin",async(req,res)=>{
  console.log("Received API request");
  const {adminId} = req.body;
  if (!adminId) res.status(500).json({message:"Missing Parameters"});
  else{
    try{
      await Admin.deleteOne({_id:adminId});
      res.status(200).json({message:"Good To Go!"});
    }
    catch(error){
      console.log(error);
      res.status(500).json({message:"Unexpected Error"});
    }
  }
})

app.post("/loginadmin",async(req,res)=>{
  console.log("Received API request");
  const {email,password} = req.body;
  if (!email || !password) res.status(500).json({message:"Missing Parameters"});
  else{
    try{
      const hashPassword = crypto.createHash("sha256").update(password).digest("hex");
      const findAdmin = await Admin.findOne({email:email,password:hashPassword});
      if (findAdmin){
        console.log(findAdmin);
        return res.status(200).json({
          success: true,
          message: 'Login successful',
          userId: findAdmin._id
        });
      }
      else{
        console.log("Invalid Credentials!");
        res.status(500).json({message:"Bad Credentials"});
      }
    }
    catch(error){
      res.status(500).json({message:"Unexpected Error!"});
      console.log(error);
    }
  }
  
})

app.post("/adminhomepage",async(req,res)=>{
  console.log("Received API request");
  const {adminId} = req.body;
  if (!adminId) res.status(500).json({message:"Missing paramters"});
  else{
    const findadmin = await Admin.findOne({_id:adminId});
    if (findadmin){
      try{
        const loans = await Loan.find({});
        const admins = await Admin.find({});
        const verifier = await Verifier.find({});
        res.status(200).json({
          message:"Good To Go!",
          loans:loans,
          admins:admins,
          verifier:verifier
        })
      }
      catch(error){
        console.log(error);
        res.status(500).json({message:"Unexpected Error!"});
      }
    }
    else{
      res.status(500).json({message:"Bad credentials!"});
    }
  }
})

app.listen(process.env.port,()=>{
    console.log("server is running");
})