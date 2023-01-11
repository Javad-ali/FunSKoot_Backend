import express from "express";
import {createPost, getFeedPosts, getUserPosts, likePost, commentPost, deleteComment, deletePost, reportPost} from "../controllers/posts.js";
import {verifyToken} from "../middleware/auth.js";    

const router = express.Router();

/* READ */
router.get("/",verifyToken,getFeedPosts);
router.get("/:userId/posts",verifyToken,getUserPosts);
router.post("/",verifyToken,createPost)
router.delete("/:id/deletePost", verifyToken,deletePost)
/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);
router.patch("/:id/comment", verifyToken, commentPost);
router.delete("/:id/deleteComment", verifyToken,deleteComment );

router.route('/:id/report')
.post(verifyToken,reportPost)

export default router;