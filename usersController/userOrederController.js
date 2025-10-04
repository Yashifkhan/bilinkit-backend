import db from "../config/db.js";

export const addOrders = (req, resp) => {
  const user_id = req.params.id; // from URL
  console.log("User ID:", user_id);
  console.log("Request Body:", req.body);

  let { product_id, delivered_address, payment_method, buy_price, quantity } = req.body;

  // Convert address to JSON string if needed
  if (typeof delivered_address === "object") {
    delivered_address = JSON.stringify(delivered_address);
  }

  // 1️⃣ Insert order first
  const insertOrderSQL = `
    INSERT INTO orders 
    (user_id, product_id, delivered_address, payment_method, buy_price, quantity) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    insertOrderSQL,
    [user_id, product_id, delivered_address, payment_method, buy_price, quantity],
    (err, orderResult) => {
      if (err) {
        console.error("Order Insert Error:", err);
        return resp.status(500).json({
          message: "Server error while placing order",
          success: false,
          error: err,
        });
      }

      console.log("Order inserted:", orderResult);

      // 2️⃣ Get current stock for product
      const getStockSQL = `SELECT stock FROM products WHERE id = ?`;
      db.query(getStockSQL, [product_id], (err, stockResult) => {
        if (err) {
          console.error("Stock Fetch Error:", err);
          return resp.status(500).json({
            message: "Error fetching product stock",
            success: false,
            error: err,
          });
        }

        if (stockResult.length === 0) {
          return resp.status(404).json({
            message: "Product not found",
            success: false,
          });
        }

        const currentStock = stockResult[0].stock;
        const newStock = currentStock - quantity;

        // Prevent stock from going below zero
        if (newStock < 0) {
          return resp.status(400).json({
            message: "Not enough stock available",
            success: false,
          });
        }

        // 3️⃣ Update stock
        const updateStockSQL = `UPDATE products SET stock = ? WHERE id = ?`;
        db.query(updateStockSQL, [newStock, product_id], (err, updateResult) => {
          if (err) {
            console.error("Stock Update Error:", err);
            return resp.status(500).json({
              message: "Error updating stock",
              success: false,
              error: err,
            });
          }

          console.log(`Stock updated successfully for product ${product_id}: ${newStock}`);

          // ✅ Final response after both success
          return resp.status(200).json({
            message: "Order placed and stock updated successfully",
            success: true,
            order: orderResult,
            newStock,
          });
        });
      });
    }
  );
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


