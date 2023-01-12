import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import ChatRoutes from "./routes/chat.js";
import MessageRoutes from "./routes/message.js";
import {register} from "./controllers/auth.js";
import {createPost} from "./controllers/posts.js"; 
import {verifyToken} from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users,posts } from "./data/index.js";
import adminRoute from './routes/admin.js'


import {createServer} from 'http';
import {Server} from 'socket.io';

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("tiny"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors({origin:'http://localhost:3000'}));
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));



/*ROUTES WITH FILES*/
app.post("/auth/register",register);
app.post("/posts",verifyToken, createPost);

/* ROUTES */
app.use("/auth",authRoutes);
app.use("/users",userRoutes);
app.use("/posts", postRoutes);
app.use("/chat",ChatRoutes);
app.use("/message",MessageRoutes);
app.use('/admin',adminRoute)

/* MONGOSE SETUP*/
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("DATABASE CONNECTED");
    /* ADD DATA ONE TIME */
// User.insertMany(users);
// Post.insertMany(posts);
})
.catch((error) => console.log(`${error} did not connected`));


const httpServer=createServer(app);

const io=new Server(httpServer,{
    cors:{
        origin:'http://localhost:3000'
    }
})

let activeUsers =[]

io.on("connection",(socket)=>{

    // add new User
    socket.on('new-user-add',(newUserId)=>{
        // if user is not added previously
        if(!activeUsers.some((user)=>user.userId === newUserId))
        {
             activeUsers.push({
                userId:newUserId,
                socketId: socket.id
             })
        }
         console.log("Connected Users", activeUsers);
        io.emit('get-users', activeUsers)
    })

    //send message
    socket.on("send-message",(data)=>{
        const {receiverId}= data;
        const user = activeUsers.find((user)=>user.userId === receiverId)
        console.log("Sending from socket to :",receiverId);
        console.log("Data",data);
        if(user){
            io.to(user.socketId).emit("receive-message",data)
        }
    })

    socket.on("disconnect",()=>{
        activeUsers =activeUsers.filter((user)=>user.socketId !==socket.id);
        console.log("User Disconnected", activeUsers);
        io.emit('get-users', activeUsers)

    })
})

httpServer.listen(process.env.PORT,()=>
    console.log(`Connected on ${process.env.PORT}`)
)
