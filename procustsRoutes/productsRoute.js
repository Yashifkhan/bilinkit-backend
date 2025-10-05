// import express from "express";
// const router=express.Router()
// const productRouter=router
// import path from "path"
// import multer from "multer"
// import fs from "fs"


// const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';

// // ensure upload dir exists
// if (!fs.existsSync(UPLOAD_DIR)) {
//   fs.mkdirSync(UPLOAD_DIR, { recursive: true });
// }

// const storage = multer.diskStorage({
//     destination:(req,file,cb)=>{
//         cb(null,UPLOAD_DIR)
//     },
//     filename:(req,file ,cb)=>{
//         const ext=path.extname(file.originalname);
//         const name=Date.now()+ '-'+Math.round(Math.random() * 1e9)+ext;
//         cb(null,name)
//     }
// })

// const fileFilter =(req,file,cb)=>{
//     if(file.mimtype.startsWith('image/')) cb(null,true);
//     else cb(new Error('Only image files are allowed!'),false)
// }
// const uploads =multer({
//     storage,fileFilter,
//     limits:{fileSize:2*1024*1024}
// })


// app.use('/uploads', express.static(path.join(__dirname, UPLOAD_DIR)));
// import { addProduct, getProducts } from "../productsController/productsController.js";

// productRouter.route("/addProduct",uploads.single('image')).post(addProduct)
// productRouter.route("/getProducts/:id").get(getProducts)

// export {productRouter}




import express from "express";
import path from "path";
import multer from "multer";
import fs from "fs";
import { addOfferProducts, addProduct, getAllProducts, getProducts, updateProduct, updateProductStatus } from "../productsController/productsController.js";

const productRouter = express.Router();

// --- Upload config ---
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';

// ensure upload dir exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, name);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Only image files are allowed!'), false);
};

const uploads = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

// --- Routes ---
productRouter.post("/addProduct", uploads.single('image'), addProduct);
productRouter.put("/updateProduct/:id",   uploads.single('image'),updateProduct)
productRouter.get("/getProducts/:id", getProducts);
productRouter.get("/getAllProducts",getAllProducts)
productRouter.put("/updateProductStatus/:id",updateProductStatus)
productRouter.post("/addOfferProducts",addOfferProducts)

export { productRouter };
