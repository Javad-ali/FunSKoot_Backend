import express from "express";
import { blockAndUnblock, getAllReports, getAllUsers, getAUser, ignoreReport, login, removePost } from "../controllers/admin.js";
import { verifyAdmin } from "../middleware/adminAuth.js";

const router = express.Router()

router.route('/login')
    .post(login)
router.route('/users')
    .get(verifyAdmin,getAllUsers)

router.route('/users/:id')
    .get(verifyAdmin,getAUser)
    .patch(verifyAdmin,blockAndUnblock)
router.route('/report')
.get(verifyAdmin,getAllReports)

router.route('/report/:id')
.patch(verifyAdmin,ignoreReport)
.delete(verifyAdmin,removePost)

export default router