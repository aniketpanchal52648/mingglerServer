import ChatModel from '../Model/ChatMode.js';

export const createChat=async(req,res)=>{
    try{    
        const newChat=new ChatModel({
            members:[req.body.senderId,req.body.receiverId]
            
        }) 
        const result=await newChat.save();
        res.status(200).json(result);

    }catch(error){
        res.status(500).json(error)
    }
}
export const userChats=async(req,res)=>{
    try{
        console.log(req.params.userId);
        const chat=await ChatModel.find({
            members:{$in:[req.params.userId]}
        })
        res.status(200).json(chat);


    }catch(error){
        console.log("here");
        res.status(500).json(error)
    }
}

export const findChat=async(req,res)=>{
    try{
        const {firstId,secondId}=req.params;
        console.log(firstId,secondId);
        const chat=await ChatModel.findOne({
            members:{$all:[firstId,secondId]}
        })
        res.status(200).json(chat);


    }catch(error){
        res.status(500).json(error)
    }
}