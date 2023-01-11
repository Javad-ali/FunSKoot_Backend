import adminModel from "../models/admin.js"
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import reportModel from "../models/reports.js"
import PostModel from "../models/Post.js"
export const login = async (req, res) => {
    try {
        console.log(req.body)
        const { email, password } = req.body
        if (!email || !password) return res.status(400).json({ message: 'all fields require' })
        const found = await adminModel.findOne({ email })
        if (!found) return res.status(400).json({ message: 'wrong credentials' })
        const hash = await bcrypt.compare(password, found.password)
        if (!hash) return res.status(400).json({ message: 'wrong credentials' })
        const token = jwt.sign({ role: 'admin', id: found._id }, process.env.JWT_SECRET)

        res.status(200).json({ token: token, user: found })
    } catch (error) {
        console.log(error)
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({})
        res.status(200).json(users)
    } catch (error) {
        console.log(error)
    }
}

export const getAUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
    }
}
export const blockAndUnblock = async (req, res) => {
    try {
        const found = await User.findById(req.params.id)
        if (!found) return res.status(404).json({ message: 'no user found' })
        if (found.block) {
            await User.findByIdAndUpdate(found._id, { $set: { block: false } })
            return res.status(201).json({ message: 'user unblocked successfully' })
        } else {
            await User.findByIdAndUpdate(found._id, { $set: { block: true } })
            return res.status(201).json({ message: 'user blocked successfully' })
        }
    } catch (error) {
        console.log(error)
    }
}
export const getAllReports = async (req, res) => {
    try {
        const reports = await reportModel.find({}).populate('postid').populate({ path: 'reports', populate: 'userid' }).populate({ path: 'postid', populate: 'userId' })
        res.status(200).json(reports)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'something went wrong' })
    }
}

export const ignoreReport = async (req, res) => {
    try {
        const found = await reportModel.findById(req.params.id)
        if (!found) return res.status(404).json({ message: 'Report not Found' })
        await reportModel.findByIdAndDelete(req.params.id)
        return res.status(200).json({ message: 'Report Ignored' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'something went wrong' })
    }
}
export const removePost = async (req, res) => {
    try {
        const found = await reportModel.findById(req.params.id)
        if (!found) return res.status(404).json({ message: 'Report not Found' })
        const postFound = await PostModel.findById(found.postid)
        if (!postFound) return res.status(404).json({ message: 'Post not Found' })
        await PostModel.findByIdAndDelete(postFound._id)
        await reportModel.findByIdAndDelete(req.params.id)
        return res.status(201).json({ message: 'post Remove successfully' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'something went wrong' })
    }
}