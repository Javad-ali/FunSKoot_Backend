import mongoose from "mongoose";

const postSchema = mongoose.Schema(
    {
        userId:{
            type:mongoose.Types.ObjectId,
            ref:'User',
        },

        location: String,
        description:String,
        picturePath:String,
        userPicturePath:String,
        likes:{
            type:Map,
            of:Boolean,
        },
        // comments:{
        //     type:Array,
        //     default:[],
        // },
        comments:[{
            userId:
            {type: mongoose.Types.ObjectId,
                ref:'User'
            },
            comment:{type: String,},
            time:{
                type: Date,
                default:new Date(),
            }
        }],
        deleteVisibility:{
            default:false,
            type:Boolean,
        },

    },
    {timestamps:true}
);
const Post = mongoose.model("Post",postSchema);
export default Post;