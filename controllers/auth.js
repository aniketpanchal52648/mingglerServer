import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import User from '../Model/user.js';

export const register=async (req,res)=>{
    try{
        // console.log(req.file.path);
        console.log("insider register controller");
        const {firstName,lastName,email,password,friends,location,occupation}=req.body;
        // const picturePath=req.files.map(f => ({ url: f.path, filename: f.filename }));
        const salt=await bcrypt.genSalt();
        const passwordHash=await bcrypt.hash(password,salt);
        const newUser=new User({
            firstName,
            lastName,
            email,
            password:passwordHash,
            picturePath:req.file.path,friends,location,occupation,
            viewedProfile: Math.floor(Math.random()*1000),
            impression:Math.floor(Math.random()*1000)

        })
        const savedUser=await newUser.save();
        console.Console.log(savedUser);
        res.status(201).json(savedUser);


    }catch(err){
            res.status(500).json({error:err.message})
    }

}
export const Login = async(req,res)=>{
    try{
        const {email,password}=req.body;
        console.log(req.body);

        const user =await User.findOne({email:email});
        if(!user){
            res.status(400).json({msg:"User not found"});

        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch)   res.status(400).json({msg:"Invalid credentials"});

        const token=jwt.sign({id:user._id},process.env.JWT_SECRET);
        delete user.password;
        console.log({token,user});
        res.status(200).json({token,user})

    }
    catch(err){
        res.status(500).json({error:err.message})
    }

}
