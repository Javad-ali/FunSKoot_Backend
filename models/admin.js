import mongoose from 'mongoose'

const adminSchema = mongoose.Schema({
    name:{
        type:String,
        default:'Admin'
    },
    email:{
        type:String
    },
    password:{
        type:String
    }
})
const adminModel = mongoose.model('admin',adminSchema)
export default adminModel