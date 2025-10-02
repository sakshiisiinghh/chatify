import jwt from 'jsonwebtoken';

export const generateToken=(userId,res)=>{
 const token=jwt.sign({userId},process.env.JWT_SECRET,{
    expiresIn:"7d"
 });
 res.cookie("token",token,{
    httpOnly:true, //prevent client-side JS from accessing the cookie
    secure:process.env.NODE_ENV==="production", //set to true in production
    sameSite:"strict",//CSRF attacks cross-site request forgery
    maxAge:7*24*60*60*1000 //in milliseconds
 });
 return token;
}