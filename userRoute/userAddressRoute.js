import express from "express";
import { addAddress, getAddresById } from "../usersController/userAddressController.js";
const addressrouter = express.Router();

addressrouter.route("/addAddress/:id").post(addAddress)
addressrouter.route("/getAddresById/:id").get(getAddresById)

export {addressrouter}
