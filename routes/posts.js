import express from "express";
import {createPost, getFeedPosts, getUserPosts, likePost} from "../controllers/posts.js";
import {verifyToken} from "../middleware/auth.js";    

const router = express.Router();

/* READ */
router.get("/",verifyToken,getFeedPosts);
router.get("/:userId/posts",verifyToken,getUserPosts);
router.post("/",verifyToken,createPost)
/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);

export default router;