import express from "express";
import { addShopKeeper, getShopKeeper, updateShopKeeperStatus } from "../shopKeeperController/shopKeeperController.js";
const router = express.Router();

// import { addShopKeeper, getShopKeeper } from './shopkeeperController.js';

router.route("/addShopKeeper").post(addShopKeeper)
router.route("/getShopKeeper").get(getShopKeeper)
router.route("/updateShopKeeperStatus/:id").put(updateShopKeeperStatus)



export default router