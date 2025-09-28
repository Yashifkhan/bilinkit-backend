import express from "express";
import { addOrders, getOrdersByUser } from "../usersController/userOrederController.js";
const orderRouter = express.Router(); 

orderRouter.route("/addOrders/:id").post(addOrders)
orderRouter.route("/getOrdersByUser/:id").get(getOrdersByUser)

export {orderRouter}



