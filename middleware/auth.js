import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = async (req,res,next)=>{
    try {
        let token = req.header("Authorization");
 
        if(!token){
            return res.status(403).send("Access Denied");
        }

        if(token.startsWith("Bearer ")){
            token = token.slice(7,token.length).trimLeft();
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        console.log(verified);
        const user = await User.findById(verified.id)
        if(user.block)return res.status(403).json({message:'Forbidden'})
        req.user = verified;
        req.userToken=token
        next();
    } catch (error) {
        console.log(error)
        res.status(500).json({error: error.message})
        
    }
} 