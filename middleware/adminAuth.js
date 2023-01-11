import jwt from "jsonwebtoken"

export const verifyAdmin =async(req,res,next)=>{
    try {
        console.log(req.headers)
        const token = req.headers.authorization ||req.headers.Authorization
        if(!token) return res.status(401).json({message:'unauthorized'})
        console.log(token)
        jwt.verify(token,process.env.JWT_SECRET,(err,decode)=>{
            if(err) return res.status(403).json({message:'Forbidden'})
            console.log(decode)
            next()
        })
    } catch (error) {
       console.log(error) 
       res.status(500).json({message:"something went wrong"})
    }
}