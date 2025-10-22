import express from "express";
import { addToCart, deletItemFromCart, getCartItems } from "./cartController.js";
const cartRouter = express.Router();

cartRouter.route("/addToCart/:id").post(addToCart)
cartRouter.route("/getCartItems/:id").get(getCartItems)
cartRouter.route("/deletItemFromCart/:productId/:userId/:deletItem").delete(deletItemFromCart)


export {cartRouter}