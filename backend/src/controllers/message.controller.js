import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId } from "../lib/socket.js";
import { io } from "../lib/socket.js";

export const getUsersForSidebar=async(req,res)=>{   
try{
    const loggedInUserId=req.user._id; // Assuming protectRoute middleware sets req.user
    // Fetch users excluding the logged-in user
    const filteredUsers=await User.find({_id:{$nin:[loggedInUserId,...(req.user.hiddenContacts||[])]}}).select('-password -hiddenContacts');
    res.status(200).json(filteredUsers);
}catch(error){
    console.error("Error fetching users for sidebar:",error);
    res.status(500).json({message:"Server error"});
}
};

export const getMessages=async(req,res)=>{
    try{
        const { userId:userToChatId }=req.params;
        const myId=req.user._id; // Assuming protectRoute middleware sets req.user
       
        const messages=await Message.find({
            $or:[
                {senderId:myId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:myId}
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
        const {userId:receiverId}=req.params;
        const senderId=req.user._id; // Assuming protectRoute middleware sets req.user ,its my id
      
        let imageUrl;
        if(image){
            //upload base64 image to cloudinar
            const uploadResponse=await cloudinary.uploader.upload(image);
            imageUrl=uploadResponse.secure_url;
        }
        const newMessage=new Message({
            senderId:senderId,
            receiverId:receiverId,
            text,
            image:imageUrl
        });
        await newMessage.save();

        // Messaging someone again brings them back into the sender's sidebar
        await User.updateOne({_id:senderId},{$pull:{hiddenContacts:receiverId}});
        // ...and into the receiver's sidebar if they had removed the sender
        await User.updateOne({_id:receiverId},{$pull:{hiddenContacts:senderId}});
        
        const receiverSocketId=getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);//send only 'to' receiver
        }
        res.status(201).json(newMessage);
    }catch(error){
        console.error("Error sending message:",error);
        res.status(500).json({message:"Server error"});
    }
};

// Removes a contact from MY history: deletes our conversation and hides them from my sidebar.
// The other user's account is never touched.
export const deleteConversation=async(req,res)=>{
    try{
        const {userId:otherId}=req.params;
        const myId=req.user._id;
        await Message.deleteMany({
            $or:[
                {senderId:myId,receiverId:otherId},
                {senderId:otherId,receiverId:myId}
            ]
        });
        await User.updateOne({_id:myId},{$addToSet:{hiddenContacts:otherId}});
        res.status(200).json({message:"Conversation deleted"});
    }catch(error){
        console.error("Error deleting conversation:",error);
        res.status(500).json({message:"Server error"});
    }
};
