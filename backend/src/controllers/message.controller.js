import User from "../models/user.model.js";
import Message from "../models/message.model.js";

export const getUsersForSidebar=async(req,res)=>{   
try{
    const loggedInUserId=req.user._id; // Assuming protectRoute middleware sets req.user
    // Fetch users excluding the logged-in user
    const filteredUsers=await User.find({_id:{$ne:loggedInUserId}}).select('-password');
    res.status(200).json(filteredUsers);
}catch(error){
    console.error("Error fetching users for sidebar:",error);
    res.status(500).json({message:"Server error"});
}
};

export const getMessages=async(req,res)=>{
    try{
        const { id:userToChatId }=req.params;
        const myId=req.user._id; // Assuming protectRoute middleware sets req.user
       
        const messages=await Message.find({
            $or:[
                {sender:myId,receiver:userToChatId},
                {sender:userToChatId,receiver:myId}
            ]
    })
    res.status(200).json(messages);
}catch(error){
        console.error("Error fetching messages:",error);
        res.status(500).json({message:"Server error"});
    }
};

export const sendMessage=async(req,res)=>{
    try{
        const {text,image}=req.body;
        const {id:receiverId}=req.params;
        const senderId=req.user._id; // Assuming protectRoute middleware sets req.user ,its my id

        let imageUrl;
        if(image){
            //upload base64 image to cloudinar
            const uploadResponse=await cloudinary.uploader.upload(image);
            imageUrl=uploadResponse.secure_url;
        }
        const newMessage=new Message({
            sender:senderId,
            receiver:receiverId,
            text,
            image:imageUrl
        });
        await newMessage.save();
        //todo-realtime functionality using socket.io
        res.status(201).json(newMessage);
    }catch(error){
        console.error("Error sending message:",error);
        res.status(500).json({message:"Server error"});
    }
};
