import db from "../config/db.js";

const addProduct = (req, resp) => {
  const { shopkeeper_id, category, name, description, price, discount, stock } = req.body  

  const image_url = req.file ? `/uploads/${req.file.filename}` : null;
  const sql = 'INSERT INTO products (shopkeeper_id,category,name,description ,price,discount,stock,image_url) VALUES  ( ? ,?, ? , ? , ? , ? , ? ,? )'
  db.query(sql, [shopkeeper_id,category, name, description, price, discount, stock, image_url], (err, result) => {
    if (err) {
      return resp.status(500).json({ message: "server error", err, success: false })
    }
    // console.log("result of products", result);
    return resp.status(200).json({ message: "product add succesfully", success: true, })
  })
}

const getProducts = (req, resp) => {
  const shopkeeper_id = req.params.id
  if (shopkeeper_id) {

    const sql = `SELECT * FROM  products where shopkeeper_id = ? AND status = 1`
    db.query(sql, [shopkeeper_id], (err, result) => {
      if (err) {
        return resp.status(500).json({ message: "server error", err, success: false })

      } else {
        return resp.status(200).json({ message: "products get successfully", success: true, data: result })
      }
    })


  } else {
    resp.status(401).json({ message: "shop keeper id is required" })
  }
}

const updateProduct = (req, res) => {
  const productId = req.params.id;
  console.log("prduct id", productId);

  const { name, price, category, description, stock, discount } = req.body;
  let imagePath = null;
  if (req.file) {
    imagePath = `/uploads/${req.file.filename}`; // public URL for the image
  }
  let sql = `UPDATE products SET name=?, price=?, category=?, description=?, stock=?, discount=?`;
  const values = [name, price, category, description, stock, discount];

  if (imagePath) {
    sql += `, image_url=?`;
    values.push(imagePath);
  }

  sql += ` WHERE id=?`;
  values.push(productId);

  // Execute MySQL query
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error updating product:", err);
      return res.status(500).json({ message: "Server error", success: false, err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found", success: false });
    }
    return res.status(200).json({ message: "Product updated successfully", success: true });
  });
};

const updateProductStatus=(req,resp)=>{
  const productId=req.params.id
  const status=req.body
  console.log("new status",status);
  
  console.log("product updated id");
  const sql="UPDATE products set status =?  where id=?"
  db.query(sql,[status,productId],(err,result)=>{
    if(err){
      return resp.status(400).json({message:"product  is not found",err})
    }else{
      resp.status(200).json({message:"Product Status Update Suiccesfully",success:true})
    }
  }) 
  
}
const getAllProducts = (req, resp) => {
  // products ke andar shopkeeper_id hai, isse users table ke id se join karenge
  // const sql = `
  //   SELECT 
  //     p.*, 
  //     u.name AS shopkeeper_name, 
  //     u.email AS shopkeeper_email 
  //   FROM products p
  //   INNER JOIN users u ON p.shopkeeper_id = u.id
  // `;

   const sql =`SELECT * FROM products`

  db.query(sql, (err, result) => {
    if (err) {
      console.error("DB error:", err);
      return resp
        .status(500)
        .json({ message: "Server error", success: false, err });
    }
    // console.log("result",result);
    

    return resp.status(200).json({
      message: "Get All Products Successfully",
      success: true,
      data: result,
    });
  });
};




export { addProduct, getProducts, updateProduct,getAllProducts ,updateProductStatus}