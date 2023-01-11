import express from "express";
import { createChat, findChat, userChats } from "../controllers/chat.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router()

router.post("/",verifyToken,createChat)
router.get("/:userId",userChats)
router.get("/find/:firstId/:secondId",findChat)

export default router