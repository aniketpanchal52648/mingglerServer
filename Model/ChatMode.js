import mongoose from "mongoose";
const ChatModelSchema=new mongoose.Schema({
    members:{
        type:Array
    }
},{timestamps:true});
const Chat=mongoose.model('Chat',ChatModelSchema);
export default Chat;