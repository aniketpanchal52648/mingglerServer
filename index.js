
// if(process.env.NODE_ENV !=='production'){
//     import { config } from "dotenv";
// }
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import multer from "multer";
import path from "path"
import morgan from "morgan";
import helmet from "helmet";
import {fileURLToPath} from "url";
import {register} from './controllers/auth.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js'
import postRoutes from './routes/post.js';
import chatRoutes from './routes/chat.js';
import messageRoutes from './routes/message.js'
import { verifyToken } from "./middleware/auth.js";
import {createPost} from './controllers/post.js';
import {CloudinaryStorage} from 'multer-storage-cloudinary'
import {v2 as cloudinary} from 'cloudinary'
import http from 'http';
import { Server } from "socket.io";

// const app = express();


// console.log(process.env)




// console.log(process.env)


// import { storage } from "./cloudinary/index.js";



// Congiguration
const __filename =fileURLToPath(import.meta.url);
const __dirname =path.dirname(__filename);

const app=express();
// const server = require('http').createServer(app);
const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:"*"
    }
});
// console.log(io);

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:'cross-origin'}))
app.use(morgan("common"));
app.use(bodyParser.json({limit:"30mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}));
app.use(cors());
app.use('/assests',express.static(path.join(__dirname,'public/assets')));
// console.log(process.env);
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret:process.env.CLOUDINARY_SECRET
})
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'Social',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});

const upload=multer({storage});
app.post('/auth/register',upload.single('picture'),register);
app.post('/post',verifyToken,upload.single('picture'),createPost)


app.use('/auth',authRoutes);
app.use('/user',userRoutes);
app.use('/post',postRoutes);
app.use('/chat',chatRoutes);
app.use('/message',messageRoutes)
let activeUsers = [];
  



//mongoose setup

const PORT=process.env.PORT || 6001;
console.log(process.env.MONGO_URL);
mongoose.connect(process.env.MONGO_URL).then(()=>{
    server.listen(PORT,()=> console.log(`connected  to DB  port ${PORT}`));
    
}).catch(err=> console.log(err));

io.on("connection", (socket) => {
    // add new User
    socket.on("new-user-add", (newUserId) => {
      // if user is not added previously
      if (!activeUsers.some((user) => user.userId === newUserId)) {
        activeUsers.push({ userId: newUserId, socketId: socket.id });
        console.log("New User Connected", activeUsers);
      }
      // send all active users to new user
      io.emit("get-users", activeUsers);
    });
  
    socket.on("disconnect", () => {
      // remove user from active users
      activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
      console.log("User Disconnected", activeUsers);
      // send all active users to all users
      io.emit("get-users", activeUsers);
    });
  
    // send message to a specific user
    socket.on("send-message", (data) => {
      const { receiverId } = data;
      const user = activeUsers.find((user) => user.userId === receiverId);
      console.log("Sending from socket to :", receiverId)
      console.log("Data: ", data)
      if (user) {
        console.log('informing receiver');
        io.to(user.socketId).emit("receive-message", data);
      }
    });
     
  }); 


