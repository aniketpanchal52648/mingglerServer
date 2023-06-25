import Post from "../Model/Post.js";
import User from "../Model/user.js";
import Comment from '../Model/comments.js';

export const createPost=async(req,res)=>{
     try{
        const {userId,description,picturePath}=req.body;
        const user=await  User.findById(userId);
        const newPost=new Post({
            userId,
            firstName:user.firstName,
            lastName:user.lastName,
            location:user.location,
            userPicturePath:user.picturePath,
            picturePath:req.file.path,
            likes:{},
            comments:[]
        });
        await newPost.save()
        const post =await Post.find();
        res.status(201).json(post);


     }catch(error){
        res.status(409).json({message:error.message});
     }
}
export const getFeedPost=async(req,res)=>{
    try{
        const post =await Post.find();
        res.status(200).json(post);
    }catch(error){
        res.status(404).json({message:error.message});

    }
}
export const getUserPost=async(req,res)=>{
    try{
       const {userId}=req.params;
       const post=await Post.find({userId});
       res.status(200).json(post);

    }catch(error){
        res.status(404).json({message:error.message});

    }

}
export const likePost=async(req,res)=>{
    try{
        const {id}=req.params;
        const {userId}=req.body;
        const post=await Post.findById(id);
        const isLiked=post.likes.get(userId);
        if(isLiked){
            post.likes.delete(userId)
        }else{
            post.likes.set(userId,true)
        }
        const updatedPost=await Post.findByIdAndUpdate(id,{likes:post.likes},{new:true});
        // console.log(updatedPost.likes);
        res.status(200).json(updatedPost);

 
     }catch(error){
         res.status(404).json({message:error.message});
 
     }

}

export const postComment=async(req,res)=>{
    
    try{
        console.log("here!!!")
        const {postId,comment,userId,firstName,lastName}=req.body;
        const post= await Post.findById(postId);
        const com= new Comment({
            userId,
            comment,
            userName:`${firstName} ${lastName}`

        });
        await com.save();
        post.comments.push(com._id);
        await post.save();
        res.status(200).json(post);

    }catch(error){
        res.status(404).json({message:error.message});
    }



}
export const getPostComment=async(req,res)=>{
    try{
        const {commentId}=req.params;
        console.log(commentId);
        const comment=await Comment.findById(commentId);
        console.log(comment);
        
        res.status(200).json(comment);
        
    }catch(error){
        res.status(404).json({message:error.message});
    }

}