import express from "express";
import {
    getUser,
    getUserFriends,
    addRemoveFriend,
    editProfile,
    editProfileImage,
    getNotification,
    getAllUsers,
} from "../controllers/users.js";
import {verifyToken} from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.route("/")
.get(verifyToken,getAllUsers)
router.get("/:id",verifyToken, getUser);
router.get("/:id/friends",verifyToken, getUserFriends);
router.get("/:userId/notifications",verifyToken,getNotification)
// router.get("/")

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);
router.put("/:id/editProfile",verifyToken,editProfile);
router.put("/:id/editProfileImage",verifyToken,editProfileImage);


export default router;