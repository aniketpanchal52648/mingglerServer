
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
import { verifyToken } from "./middleware/auth.js";
import {createPost} from './controllers/post.js';
import {CloudinaryStorage} from 'multer-storage-cloudinary'
import {v2 as cloudinary} from 'cloudinary'
// console.log(process.env)




// console.log(process.env)


// import { storage } from "./cloudinary/index.js";



// Congiguration
const __filename =fileURLToPath(import.meta.url);
const __dirname =path.dirname(__filename);

const app=express();
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



//mongoose setup

const PORT=process.env.PORT || 6001;
console.log(process.env.MONGO_URL);
mongoose.connect(process.env.MONGO_URL).then(()=>{
    app.listen(PORT,()=> console.log(`connected  to DB  port ${PORT}`));
    
}).catch(err=> console.log(err));


