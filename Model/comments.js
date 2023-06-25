import mongoose from "mongoose";
const commentSchema= new mongoose.Schema({
    userName:{
        type:String,
        require:true

    },
    userId:{
        type:String,
        require:true
    },
    comment:{
        type:String,
        require:true
    }
},{timestamps:true});

const Comment=mongoose.model('Comment',commentSchema);
export default  Comment