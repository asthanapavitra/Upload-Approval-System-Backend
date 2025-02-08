const express = require("express");
const multer = require("multer");
const faceapi = require("../utils/faceApiModelLoader").faceapi;
const canvas = require("canvas");
const bcrypt = require("bcrypt");
const authenticateJWT=require('../middlewares/isLoggedIn')
const User = require("../models/userModel");
const jwt=require('jsonwebtoken');

const router = express.Router();

// Multer Setup for File Uploads (Memory Storage)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/register',(req,res)=>{
    res.render('index');
})
router.get('/login',(req,res)=>{
    res.render('login');
})
router.post('/register', upload.single("profilePicture"), async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const fileBuffer = req.file.buffer;

        // Convert buffer to Image
        const img = await canvas.loadImage(fileBuffer);

        // Detect face and extract descriptor
        const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

        if (!detection) {
            return res.status(400).json({ message: "No face detected in the image. Please upload a clear face image." });
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Store descriptor (face data)
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            faceData: detection.descriptor, // Storing extracted face descriptor
            profilePicture: fileBuffer
        });

        res.redirect('/users/login');

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
router.post('/login',async(req,res)=>{
    try{
        let{email,password}=req.body;
    let user=await User.findOne({email});
    if(!user){
       return res.send("Email or password incorrect");
    }
    await bcrypt.compare(password,user.password,(err,result)=>{
        if(result){
            let token =jwt.sign({email,id:user._id},process.env.JWT_SECRET);
            res.cookie("token",token);
            res.redirect('/users/dashboard');
        }
        else{
            res.send("Email or password incorrect");
        }
    })
    }
    catch(err){
        res.send({message:err.message});
    }
    
})

router.get('/dashboard', authenticateJWT, async (req, res) => {
    try {
        let user = await User.findOne({ email: req.user.email })
            .populate({
                path: 'pendingApprovals',
                populate: {
                    path: 'uploader',
                    select: 'name email'
                }
            })
            .populate({
                path: 'uploads',
                populate: {
                    path: 'uploader',
                    select: 'name email'
                }
            });

        res.render('dashboard', { user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});



router.get('/logout',(req,res)=>{
    res.clearCookie('token');
    res.redirect('/users/login');
})
module.exports = router;
