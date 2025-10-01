import express from "express";
import { addAddress, getAddresById, updateAddress } from "../usersController/userAddressController.js";
const addressrouter = express.Router();

addressrouter.route("/addAddress/:id").post(addAddress)
addressrouter.route("/getAddresById/:id").get(getAddresById)
addressrouter.route("/updateAddress/:id").put(updateAddress)

export {addressrouter}
