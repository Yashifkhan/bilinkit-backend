// import express from "express"
// const app=express()
// import dotenv from "dotenv"
// import cors from "cors"
// import router from "./shopKeeperRoute/shopkeeperRoute.js"
// import { fileURLToPath } from 'url';
// // import { productRouter } from "./routes/productRoutes.js";
// dotenv.config()

// app.use(express.json())
// app.use(cors())
// import path from "path";
// import { productRouter } from "./procustsRoutes/productsRoute.js"
// import { usersRouter } from "./userRoutes/userRoute.js"
// import { cartRouter } from "./cartRoutes.js"
// import { addressrouter } from "./userRoute/userAddressRoute.js"
// import { orderRouter } from "./userRoute/userOrderRoute.js"

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// app.use("/api/v1/shopKeeper",router)
// app.use("/api/v1/products",productRouter)
// app.use("/api/v1/users",usersRouter)
// app.use("/api/v1/cart",cartRouter)
// app.use("/api/v1/address",addressrouter)
// app.use("/api/v1/orders",orderRouter)

// app.listen(process.env.PORT ,()=>{
//     console.log("server is runing success");    
// })




import express from "express"
const app=express()
import dotenv from "dotenv"
import cors from "cors"
import router from "./shopKeeperRoute/shopkeeperRoute.js"
import { fileURLToPath } from 'url';
dotenv.config()

app.use(express.json())
app.use(cors())
import path from "path";
import { productRouter } from "./procustsRoutes/productsRoute.js"
import { usersRouter } from "./userRoutes/userRoute.js"
import { cartRouter } from "./cartRoutes.js"
import { addressrouter } from "./userRoute/userAddressRoute.js"
import { orderRouter } from "./userRoute/userOrderRoute.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/v1/shopKeeper",router)
app.use("/api/v1/products",productRouter)
app.use("/api/v1/users",usersRouter)
app.use("/api/v1/cart",cartRouter)
app.use("/api/v1/address",addressrouter)
app.use("/api/v1/orders",orderRouter)

app.listen(process.env.PORT ,()=>{
    console.log("server is runing success");    
})
