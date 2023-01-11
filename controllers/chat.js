import Chat from "../models/Chat.js"

export const createChat = async (req, res) => {
    console.log(req.body)
    const found = await Chat.findOne({sender:req.user.id,reciever:req.body.receiverId})
    console.log(found)
    if(found) return res.status(304).json({message:'chat already exist'})
    const newChat = new Chat({
        sender:req.user.id,
        reciever:req.body.receiverId,
        members: [req.user.id, req.body.receiverId]
    });
    try {
        const result = await newChat.save();
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
}; 


export const userChats = async(req,res) => {
    try {
        const chat = await Chat.find({
            members: {$in: [req.params.userId]}
        })
        res.status(200).json(chat)

    } catch (error) {
      res.status(500).json(error)
    }
}

export const findChat = async(req,res) =>{
    try {
        const chat = await Chat.findOne({
            members: {$all: [req.params.firstId, req.params.secondId]}
        })
        res.status(200).json(chat)
    } catch (error) {
        res.status(500).json(error)

    }
}