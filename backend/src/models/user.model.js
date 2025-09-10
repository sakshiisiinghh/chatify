import mongoose from "mongoose";    

const userSchema = new mongoose.Schema(
    {
        email: {
            type:String,
            required: true,
            unique: true,                     
        },
        fullName: {
            type: String,
            required: true,     
        },
        password: {
            type: String,
            required: true,    
            minlegth: 6, 
        } ,
        profilePic: {
            type: String, // URL to the profile picture
            default: "",  // Default to an empty string if no picture is provided
        },  
}, 
{ timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;