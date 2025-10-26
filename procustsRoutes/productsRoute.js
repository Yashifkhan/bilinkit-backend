
import express from "express";
import path from "path";
import multer from "multer";
import fs from "fs";
import { addOfferProducts, addProduct, getAllProducts, getOffersProducts, getProducts, updateProduct, updateProductStatus } from "../productsController/productsController.js";

const productRouter = express.Router();

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
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
productRouter.route("/getOffersProducts").get(getOffersProducts)

export { productRouter };
