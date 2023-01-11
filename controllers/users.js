import User from "../models/User.js";
import { Types } from "mongoose";
import jwt from 'jsonwebtoken'

/* READ */
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
        res.status(404).json({ message: error.message })
    }
}


export const getUserFriends = async (req, res) => {
    try {

        // let token=jwt.decode(req.userToken)
        // console.log(token);
        const { id } = req.params;
        const user = await User.findById(id);
        // const formattedFriends=await User.aggregate([
        //     {
        //       '$match': {
        //         '_id': Types.ObjectId(id)
        //       }
        //     }, {
        //       '$lookup': {
        //         'from': 'posts', 
        //         'localField': '_id', 
        //         'foreignField': 'userId', 
        //         'as': 'friendsPost'
        //       }
        //     }, {
        //       '$project': {
        //         'inFriendList': {
        //           '$in': [
        //             token.id, '$friends'
        //           ]
        //         }, 
        //         'firstName': 1, 
        //         'lastName': 1, 
        //         'email': 1, 
        //         'picturePath': 1, 
        //         'friends': 1, 
        //         'location': 1, 
        //         'occupation': 1, 
        //         'viewedProfile': 1, 
        //         'impressions': 1, 
        //         'createdAt': 1, 
        //         'updatedAt': 1, 
        //         'friendsPost': 1
        //       }
        //     }
        //   ])

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );
        res.status(200).json(formattedFriends);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};


/* UPDATE */
export const addRemoveFriend = async (req, res) => {
    try {
        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id !== friendId);
            friend.friends = friend.friends.filter((id) => id !== id);
        } else {
            user.friends.push(friendId);
            friend.friends.push(id);
        }
        await user.save();
        await friend.save();

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );
        res.status(200).json(formattedFriends);
    } catch (error) {
        res.status(404).json({ message: error.message });

    }
}

export const editProfile = async (req, res) => {
    try {
        console.log(req.body)
        const { id } = req.params
        const updatedprofile = await User.findByIdAndUpdate(id, { $set: req.body }, { new: true })
        console.log(updatedprofile)
        res.status(200).json(updatedprofile)
    } catch (error) {
        res.status(404).json({ message: error.message });
        console.log(error);
    }
}

export const editProfileImage = async (req, res) => {
    try {
        const { id } = req.params
        const { imageURl } = req.body
        const updatedprofileimage = await User.findByIdAndUpdate(id, { $set: { picturePath: imageURl } }, { new: true })
        res.json(updatedprofileimage)
    } catch (error) {
        res.status(404).json({ message: error.message });
        console.log(error);
    }
}


export const getNotification = async (req, res) => {
    try {
        const user = req.user
        console.log(user.id)
        const notifications = await User.findById(user.id).select({ notifications: 1 })
        res.status(200).json(notifications)
    } catch (error) {
        res.status(404).json({ message: error.message });
        console.log(error);
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const { search } = req.query
        const users = await User.find({ $or: [{ firstName: new RegExp(search, 'i') }, { lastName: new RegExp(search, 'i') }] })
        res.status(200).json(users)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'something went wrong please try after sometime' })
    }
}