import db from "../config/db.js";

export const addOrders = (req, resp) => {
    const user_id = req.params.id;   // from URL
    console.log("user id", user_id);
    console.log("req ki body", req.body);
    let { product_id, delivered_address, payment_method, buy_price, quantity } = req.body;
    // convert object to JSON string if it's not already string
    if (typeof delivered_address === "object") {
        delivered_address = JSON.stringify(delivered_address);
    }
    const sql = `
      INSERT INTO orders 
      (user_id, product_id, delivered_address, payment_method, buy_price, quantity) 
      VALUES (?,?,?,?,?,?)
    `;

    db.query(
        sql,
        [user_id, product_id, delivered_address, payment_method, buy_price, quantity],
        (err, result) => {
            if (err) {
                return resp.status(500).json({
                    message: "Server error",
                    success: false,
                    error: err
                });
            }
            return resp.status(200).json({
                message: "Order Confirm",
                success: true,
                data: result
            });
        }
    );

    console.log("product_id",product_id);
    console.log("quantity",quantity);

    const getStock="select stock from products where id=?"
    db.query(getStock,[product_id],(err,result)=>{
      if(err){
        return
      }else{
        result
      }

      console.log("result of stock ",result[0]);
      const  newStock=result[0]-quantity
      console.log("new stock ",newStock);
      const updateStock=`UPDATE products set stock =${newStock} where id=${product_id}`
          db.query([updateStock,(err,result)=>{
            if(err){
              return "products not found "
            }else{
              resp.status(200).json({message:"stock updated succesfully"})
      
            }
          }])
      
    })
    
    
  

};


export const getOrdersByUser = (req, res) => {
  const user_id = req.params.id;

  const sql = `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`;

  db.query(sql, [user_id], (err, results) => {
    if (err) {
      console.error("Error fetching orders:", err);
      return res.status(500).json({
        success: false,
        message: "Database error",
        error: err
      });
    }

    if (results.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No orders found for this user",
        data: []
      });
    }

    // ✅ Get all product IDs from the orders
    const productIds = results.map(order => order.product_id);

    // ✅ Fetch product details in one query
    const productSql = `SELECT * FROM products WHERE id IN (?)`;

    db.query(productSql, [productIds], (err, productResults) => {
      if (err) {
        console.error("Error fetching products:", err);
        return res.status(500).json({
          success: false,
          message: "Database error fetching products",
          error: err
        });
      }

      // ✅ Map products by id for easy lookup
      const productMap = {};
      productResults.forEach(prod => {
        productMap[prod.id] = prod;
      });

      // ✅ Merge orders with product info
      const ordersWithProducts = results.map(order => ({
        ...order,
        orderedProductsInfo: productMap[order.product_id] || null
      }));

      return res.status(200).json({
        success: true,
        message: "Orders fetched successfully",
        data: ordersWithProducts
      });
    });
  });
};


