import mongoose  from "mongoose";

const ChatSchema = mongoose.Schema(
  
    {
    sender:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
    reciever:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    members: {
        type:Array,
    },
},
{
    timestamps:true,
}
);
const Chat = mongoose.model("Chat",ChatSchema);
export default Chat;
