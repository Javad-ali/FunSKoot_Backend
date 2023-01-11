import express from "express";
import {login, sendOtp, verifyOtp} from "../controllers/auth.js";

const router = express.Router();

router.post("/login" , login);
router.get("/otp",sendOtp)
router.post("/otp",verifyOtp)

export default router;