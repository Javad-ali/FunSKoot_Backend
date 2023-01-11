import mongoose from "mongoose";

const OtpSchema = mongoose.Schema({
    email:{
    type:String,
    required:true
      },
      otp:{
        type:String,
        required:true
      }
})

const otpModel= mongoose.model("otp",OtpSchema)
export default otpModel