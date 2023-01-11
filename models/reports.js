import mongoose from "mongoose";

const reportSchema = mongoose.Schema({
    postid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    },
    reports:[
        {
            report:String,
            userid:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'User'
            }
        }
    ]
})

const reportModel = mongoose.model('report',reportSchema)

export default reportModel