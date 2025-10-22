
import db from "./config/db.js";

export const addToCart = (req, resp) => {
    console.log("req body", req.body);
    const { user_id, product_id, quantity } = req.body;

    // 1️⃣ Check if product already exists in the cart for this user
    const checkSql = `SELECT * FROM cart WHERE user_id = ? AND product_id = ?`;
    db.query(checkSql, [user_id, product_id], (err, result) => {
        if (err) {
            return resp.status(500).json({ message: "server error", error: err, success: false });
        }

        if (result.length > 0) {
            // 2️⃣ Product exists → increase quantity
            const updateSql = `UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?`;
            db.query(updateSql, [quantity, user_id, product_id], (err2, result2) => {
                if (err2) {
                    return resp.status(500).json({ message: "server error", error: err2, success: false });
                }
                return resp.status(200).json({ message: "Quantity updated successfully", success: true });
            });
        } else {
            // 3️⃣ Product does not exist → insert new row
            const insertSql = `INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)`;
            db.query(insertSql, [user_id, product_id, quantity], (err3, result3) => {
                if (err3) {
                    return resp.status(500).json({ message: "server error", error: err3, success: false });
                }
                return resp.status(200).json({ message: "Item added to cart successfully", success: true });
            });
        }
    });
};

export const getCartItems = (req, resp) => {
    const user_id = req.params.id;

    // Step 1: Get cart items for this user
    const sql = "SELECT * FROM cart WHERE user_id = ? AND quantity > 0";
    db.query(sql, [user_id], (err, cartItems) => {
        if (err) {
            return resp.status(500).json({
                message: "Server error: cart items not fetched",
                error: err,
                success: false
            });
        }

        if (cartItems.length === 0) {
            return resp.status(200).json({
                message: "Cart is empty",
                success: true,
                cart: [],
                products: []
            });
        }

        // Step 2: Get product IDs from cart
        const productIds = cartItems.map(item => item.product_id);

        // Step 3: Get product details
        const getProductsById = "SELECT * FROM products WHERE id IN (?)";
        db.query(getProductsById, [productIds], (err, products) => {
            if (err) {
                return resp.status(500).json({
                    message: "Error fetching product details",
                    error: err,
                    success: false
                });
            }

            // Step 4: Merge cart items with product details
            const finalData = cartItems.map(cartItem => {
                const product = products.find(p => p.id === cartItem.product_id);
                return {
                    ...product,              // product details
                    quantity: cartItem.quantity // quantity from cart
                };
            });

            return resp.status(200).json({
                message: "Cart and product details fetched successfully",
                success: true,
                data: finalData
            });

        });
    });
};


// export const deletItemFromCart = (req, resp) => {

//     console.log("delect from cart function is executed");

//     const product_id = req.params.productId
//     const user_id = req.params.userId
//     console.log("user id:", user_id,);
//     console.log("products id:", product_id);

//     const sql = "delete  from cart where user_id=? AND product_id = ?"
//     db.query(sql, [ user_id,product_id], (err, result) => {
//         if (err) {
//             return resp.status(500).json({ message: 'server error', success: false,error:err })
//         } 
//             resp.status(200).json({ message: "delete item  from cart", success: true,data:result })
//     })
// }

export const deletItemFromCart = (req, resp) => {

    const product_id = req.params.productId
    const user_id = req.params.userId
    const deleteItem=req.params.deletItem
    console.log("deletItem",deleteItem);
    
    if(deleteItem === true){
        const sql = "delete  from cart where user_id=? AND product_id = ?"
    db.query(sql, [ user_id,product_id], (err, result) => {
        if (err) {
            return resp.status(500).json({ message: 'server error', success: false,error:err })
        } 
            resp.status(200).json({ message: "delete item  from cart", success: true,data:result })
    })
    }else{

        
        const getQuentity = "select quantity from cart where user_id = ? AND product_id = ? "
        db.query(getQuentity, [user_id, product_id], (err1, results) => {
        if (err1) {
           return resp.status(500).json({message:"server error",success:false})

        }
        const quantity = results.map((q) => q)
        const newQuan = Number(quantity[0].quantity) - 1
        
        const updateQuentity = "update cart set quantity = ? where user_id = ? AND product_id = ? "
        db.query(updateQuentity, [newQuan, user_id, product_id], (err, result) => {
            if (err) {
                return resp.status(500).json({ message: "server error", success: false })
            }
            resp.status(200).json({ message: "item remove from cart", success: true })
        })
        
        
        
    })
    
    
}
}

