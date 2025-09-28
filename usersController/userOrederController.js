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
};


export const getOrdersByUser = (req, res) => {
  const  user_id  = req.params.id

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

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: results
    });
  });
};

