var express = require('express');
var bcrypt = require('bcryptjs');
var router = express.Router();
var userModel = require("../models/userModel");
var jwt = require('jsonwebtoken');
var projectModel = require("../models/projectModel");
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const secret = "secret";

router.post("/signup", async (req, res) => {
  console.log(req.body);
  let { username, name, email, password } = req.body;
  let emailCon = await userModel.findOne({ email: email });
  if (emailCon) {
    res.json({ success: false, message: "Email already exists" });
  } else {
    bcrypt.genSalt(10, async (err, salt) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error generating salt' });
      }
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Error hashing password' });
        }
        try {
          let user = await userModel.create({
            username: username,
            name: name,
            email: email,
            password: hash
          });
          res.json({ success: true, message: 'User created successfully' });
        } catch (error) {
          return res.status(500).json({ success: false, message: 'Error creating user' });
        }
      });
    });
  }
});
router.post("/login", async (req, res) => {
  let { email, password } = req.body;

  try {
    let user = await userModel.findOne({ email: email });
    
    if (!user) {
      return res.json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid email or password' });
    }

    // Generate JWT token
    let token = jwt.sign(
      { email: user.email, userId: user._id }, 
      secret, // Ensure secret is stored securely
      { expiresIn: '1h' } 
    );
    
    return res.json({ 
      success: true, 
      message: 'User logged in successfully', 
      token: token, 
      userId: user._id 
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login' });
  }
});
router.post("/getUserDetails", async (req, res) => {
  let { userId } = req.body;
  let user = await userModel.findOne({ _id: userId });
  if (user) {
    return res.json({ success: true, message: "User details fetched successfully", user: user });
  } else {
    return res.json({ success: false, message: "User not found" });
  }
});

router.post("/createProject", async (req, res) => {
  let { userId, title } = req.body;
  let user = await userModel.findOne({ _id: userId });
  if (user) {
    let project = await projectModel.create({
      title: title,
      createdBy: userId
    });
    return res.json({ success: true, message: "Project created successfully", projectId: project._id });
  } else {
    return res.json({ success: false, message: "User not found" });
  }
});

router.post("/getProjects", async(req,res)=>{
  let {userId} =req.body;
  let user= await userModel.findOne({_id: userId});
  if(user){
    let projects = await projectModel.find({createdBy:userId});
    return res.json({success:true,message:"projects fetched successfully", projects:projects});
   }
    else{
      return res.json({success:false,message:"user not found"});
    
  }
});

router.post("/deleteProject", async(req,res)=>{
  let {userId,projId}= req.body;
  let user =await userModel.findOne({_id:userId});
  if(user){
    let project= await projectModel.findOneAndDelete({_id:projId});
    return res.json({success:true,message:"Project deleted successfully"});
  }else{
    return res.json({success:false,message:"user not found"});
  }
});

router.post("/getProject", async (req, res) => {
  let { userId, projId } = req.body;
  
  try {
    // Find the user
    let user = await userModel.findOne({ _id: userId });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Find the project
    let project = await projectModel.findOne({ _id: projId });
    if (!project) {
      return res.json({ success: false, message: "Project not found" });
    }

    // Return the project data
    return res.json({ success: true, message: "Project fetched successfully", project });
  } catch (error) {
    console.error("Error fetching project:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/updateProject",async(req,res)=>{
  let {userId,htmlCode,cssCode,jsCode,projId}=req.body;
  let user = await userModel.findOne({_id:userId});
if(user){
  let project = await projectModel.findOneAndUpdate({_id:projId},{htmlCode:htmlCode,cssCode:cssCode,jsCode:jsCode});
  return res.json({success:true,message:"Project upadated successfully"});
}else{
  return res.json({success:false,message:"user not found"});
}
})

module.exports = router;
