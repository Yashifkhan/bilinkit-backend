
import express from "express";
import fs from "fs";
import { addOfferProducts, addProduct, getAllProducts, getOffersProducts, getProducts, updateProduct, updateProductStatus } from "../productsController/productsController.js";
import { upload, uploadFile } from "../middlewares/imageMiddleware.js";

const productRouter = express.Router();

// productRouter.post("/addProduct", uploads.single('image'), addProduct);
productRouter.post("/addProduct", upload.single("image"), uploadFile, addProduct);

productRouter.put("/updateProduct/:id",   upload.single('image'),updateProduct)
productRouter.get("/getProducts/:id", getProducts);
productRouter.get("/getAllProducts",getAllProducts)
productRouter.put("/updateProductStatus/:id",updateProductStatus)
productRouter.post("/addOfferProducts",addOfferProducts)
productRouter.route("/getOffersProducts").get(getOffersProducts)

export { productRouter };
