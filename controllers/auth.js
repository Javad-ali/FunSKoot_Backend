import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import nodemailer from "nodemailer";
import otpModel from "../models/Otp.js";

/* REGISTER USER */
export const register = async (req, res) => {
    console.log(req.body)
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body;
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        const found = await User.findOne({ email })
        if (found) return res.status(400).json({ message: 'user already exist' })
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
/* LOGGING IN */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password);
        const user = await User.findOne({ email: email });
        if (!user) return res.status(400).json({ msg: "User does not exist. " });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " })
        if (user.block) return res.status(401).json({ message: 'you have been blocked by funskoot' })
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({ token, user });

    } catch (error) {
        res.status(500).json({ error: error.message });

    }
}

export const sendOtp = async (req, res) => {
    console.log(req.query)
    let email = req.query.email
    let otp = Math.floor(Math.random() * 9999)
    try {
        const found = await otpModel.findOne({ email })
        if (found) {
            await otpModel.findByIdAndDelete(found._id)
        }
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.NODEMAILER_USER,
                pass: process.env.NODEMAILER_PASS
            }
        })
        let mailOptions = {
            from: 'FunSkoot@gmail.com',
            to: email,
            subject: "OTP Sended From FunSkoot",
            text: `verify your Otp  ${otp}`
        }
        transporter.sendMail(mailOptions, async function (error, info) {
            if (error) {
                console.log(error);
            }
            else {
                const newotp = new otpModel({ email, otp })
                await newotp.save()
                return res.status(200).json({ message: "otp Success" })
            }
        })
    } catch (error) {
        console.log(error);
    }
}

export const verifyOtp = async (req, res) => {

    let email = req.body.email
    let otp = req.body.otp
    console.log(email, otp)
    const verifyOtp = await otpModel.findOne({ email, otp })
    if (verifyOtp) {
        return res.status(200).json({ message: "success" })
    }
    else {
        return res.status(400).json({ message: "invalid Otp" })
    }
}