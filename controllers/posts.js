import Post from "../models/Post.js";
import reportModel from "../models/reports.js";
import User from "../models/User.js"

/* CREATE*/
export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body;
        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: [],
        })
        await newPost.save();

        const post = await Post.find().sort({ createdAt: -1 }).populate('userId');
        res.status(201).json(post);
    } catch (error) {
        res.status(409).json({ message: error.message })
    }
}
/* READ */
export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find({}).sort({ createdAt: -1 }).populate('comments.userId').populate('userId')
        console.log(post[0].comments)
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message })

    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const post = await Post.find({ userId }).populate('comments.userId').populate('userId');
        console.log(post);
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

/* UPDATE */
export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);
        const likeAuthor = await User.findById(userId)
        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes },
            { new: true }
        ).populate('userId').populate("comments.userId");
        const notification = {
            titile: "Like",
            author: `${likeAuthor.firstName} ${likeAuthor.lastName} Liked your post`,
            picture: likeAuthor.picturePath,
            time: new Date()

        }
        console.log(updatedPost);
        const postAuthor = await User.findById(updatedPost.userId._id)
        postAuthor.notifications.unshift(notification)
        await postAuthor.save()
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(404).json({ message: error.message })

    }
}
export const commentPost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const { comment } = req.body;
        console.log(req.body, 'fddf');
        const content = { userId, comment, time: Date.now() }
        const response = await Post.findByIdAndUpdate(id, { $push: { comments: content } }, { new: true }).populate('userId').populate("comments.userId");
        response.comments = response.comments.reverse()


        console.log(response);
        res.json(response)
        // console.log(response);
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.log(error);
    }
}

export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const { comment } = req.body;
        console.log(comment, "aswinPop");
        const response = await Post.findByIdAndUpdate(id, { $pull: { comments: { _id: comment._id } } }, { new: true }).populate('comments.userId').populate('userId');
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.log(error);

    }
}
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        // const {userId} = req.body;
        const deletePost = await Post.findByIdAndUpdate(id, { $set: { deleteVisibility: true } }, { new: true })
        console.log(id, "post");
        res.status(200).json(deletePost)
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.log(error);
    }
}

export const reportPost = async (req, res) => {
    try {
        const { report } = req.body
        const foundPost = await Post.findById(req.params.id)
        if (!foundPost) return res.status(404).json({ message: 'no post found' })
        const foundReport = await reportModel.findOne({ postid: foundPost._id })
        if (!foundReport) {
            const newReport = new reportModel({ postid: foundPost._id, reports: [{ userid: req.user.id, report: report }] })
            await newReport.save()
            return res.status(201).json({message:'thank you for reporting'})
        }
        console.log(foundReport,req.user.id)
        const found = foundReport.reports.find(e => e.userid == req.user.id)
        if (found) return res.status(400).json({ message: 'you can only report once' })
        foundReport.reports.push({userId:req.user.id,report})
        await foundReport.save()
        return res.status(201).json({message:'thank you for reporting '})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'something went wrong'})
    }
}