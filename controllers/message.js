import Message from "../Model/Message.js";
export const addMessage=async(req,res)=>{
    try{
        console.log(req.body);
        const {chatId,senderId,text}=req.body;
        const message=new Message({
            chatId,
            senderId,
            text
        })
        const data= await message.save();
        console.log(data);
        res.status(200).json(data);

        
    }catch(error){
        res.status(500).json(error)
    }
}
export const getMessages=async(req,res)=>{
    try{
        const {chatId}=req.params;
        console.log(chatId);
        const result=await Message.find({chatId:chatId})
        res.status(200).json(result);
        
    }catch(error){
        res.status(500).json(error)
    }
}