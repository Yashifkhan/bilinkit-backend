
import db from "../config/db.js"
// import db from "../config/db.js"

const addShopKeeper = (req, resp) => {
    const {name, email, password_hash, phone, shop_name, shop_address,category} = req.body
    // console.log("body result",name,email);
    
    const sql = `INSERT INTO shopkeeper 
    (name, email, password_hash, phone, shop_name, shop_address,category)
     VALUES (?,?,?,?,?,?,?)`
    db.query(sql,  [name, email, password_hash, phone, shop_name, shop_address,category], (err, result) => {
        if (err) {
            resp.status(500).json({ message: "server error", err, success: false })
        } else {
            resp.status(200).json({ message: "shop keeper add succssfully", success: true,data:result })
        }
    })
}

const getShopKeeper = (req, resp) => {
    const sql = `SELECT * FROM shopkeeper`;
    db.query(sql, (err, result) => {
        if (err) {
            return resp.status(500).json({ message: "Server error", error: err, success: false });
        }
        // console.log("result", result);
        return resp.status(200).json({ message: "Shopkeepers fetched successfully", success: true, data: result });
    });
};

const updateShopKeeperStatus = (req, resp) => {
    const shopKeeperId = req.params.id;
    const { status } = req.body;   // 👈 new status should come from the request body
    

    console.log("shop keeper id:", shopKeeperId, "new status:", status);

    const sql = `UPDATE shopkeeper SET status = ? WHERE id = ?`;

    db.query(sql, [status, shopKeeperId], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return resp.status(500).json({
                message: "Server error",
                error: err,
                success: false
            });
        }

        if (result.affectedRows === 0) {
            // No shopkeeper with that ID
            return resp.status(404).json({
                message: "Shopkeeper not found",
                success: false
            });
        }

        return resp.status(200).json({
            message: "Shopkeeper status updated successfully",
            success: true
        });
    });
};



export { addShopKeeper, getShopKeeper,updateShopKeeperStatus };