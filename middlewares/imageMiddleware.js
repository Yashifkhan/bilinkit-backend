// import dotenv from "dotenv";
// import { v2 as cloudinary } from "cloudinary"
// import multer from "multer";
// import path from "path";
// import fs from "fs";
// dotenv.config();
// const uploadDir = "uploads";
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// export const upload = multer({ storage });

// export const uploadFile = async (req, resp, next) => {
//     console.log("middleware is running ");
    

//     try {
//         cloudinary.config({
//             cloud_name: process.env.CLOUD_NAME,
//             api_key: process.env.API_KEY,
//             api_secret: process.env.API_SECRET ? "✅ exists" : "❌ missing"
//         })


//         console.log("cloude name", process.env.CLOUD_NAME);
//         console.log("api_key",process.env.API_KEY);
//         console.log("api_secret", process.env.API_SECRET);

//         console.log("req,file",req.file);
//         if (!req.file) {
//             console.log("checking ");
//             return resp.status(400).json({ success: false, message: "No file uploaded" });
//         }
        

//        const uploadResult = await cloudinary.uploader.upload(req.file.path, { folder: "products" })

//         console.log("stage 1");

//         console.log("upload result", uploadResult)

//         const optimizeUrl = cloudinary.url(uploadResult.public_id, {
//             fetch_format: 'auto',
//             quality: 'auto'
//         });

//         req.cloudinaryImage = {
//             url: uploadResult.secure_url,
//             optimizedUrl: optimizeUrl,
//             public_id: uploadResult.public_id,
//         };

//         console.log("optimize url", optimizeUrl);
//         next()
//     } catch (error) {
//         console.log("error", error);

//     }

// }











import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary"
import multer from "multer";
import path from "path";
import fs from "fs";
dotenv.config();
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({ storage });

export const uploadFile = async (req, resp, next) => {
    console.log("middleware is running ");
    

    try {
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET 
        })


        console.log("cloude name", process.env.CLOUD_NAME);
        console.log("api_key",process.env.API_KEY);
        console.log("api_secret", process.env.API_SECRET);

        console.log("req,file",req.file);
        if (!req.file) {
            console.log("checking ");
            return resp.status(400).json({ success: false, message: "No file uploaded" });
        }
        

       const uploadResult = await cloudinary.uploader.upload(req.file.path, { folder: "products" })

        console.log("stage 1");

        console.log("upload result", uploadResult)

        const optimizeUrl = cloudinary.url(uploadResult.public_id, {
            fetch_format: 'auto',
            quality: 'auto'
        });

        req.cloudinaryImage = {
            url: uploadResult.secure_url,
            optimizedUrl: optimizeUrl,
            public_id: uploadResult.public_id,
        };

        console.log("optimize url", optimizeUrl);
        next()
    } catch (error) {
        console.log("error", error);

    }

}