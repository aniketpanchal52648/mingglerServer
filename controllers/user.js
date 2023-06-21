import User from "../Model/user.js";
export const getUser=async(req,res)=>{
    try{
        const {id}=req.params;
        const user=await User.findById(id);
        res.status(200).json(user);
    }catch(error){
        res.status(404).json({mesaage:error.mesaage});
    }


}
export const getUserFriends=async(req,res)=>{
    try{
        const {id}=req.params;
        const user=await User.findById(id);     
        const userFriends= await Promise.all(
            user.friends.map((id)=> User.findById(id))
        )
        const friends=userFriends.map(({_id,firstName,lastName,occupation,location,picturePath})=>
            {return {_id,firstName,lastName,occupation,location,picturePath}}
        )

        res.status(200).json(friends);





    }catch(error){
        res.status(404).json({mesaage:error.mesaage});
    }
}
export const addRemoveFriends=async(req,res)=>{
    
    try{
        
        const {id,friendId}=req.params;
       
        const user=await User.findById(id);
        const friend=await User.findById(friendId);
        

        if(user.friends.includes(friendId)){
            user.friends=user.friends.filter((id)=>id!==friendId);
            friend.friends=friend.friends.filter((Id)=>Id!==id);
        }else{
            user.friends.push(friendId);
            friend.friends.push(id);
        }
        await user.save();
        await friend.save();
        
        const userFriends= await Promise.all(
            user.friends.map((id)=> User.findById(id))
        )
        const friends=userFriends.map(({_id,firstName,lastName,occupation,location,picturePath})=>
            {return {_id,firstName,lastName,occupation,location,picturePath}}
        )

        res.status(200).json(friends);


    }catch(error){
        console.log("here")
        res.status(404).json({mesaage:error.mesaage});

    }
}