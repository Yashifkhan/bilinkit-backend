import db from "../config/db.js";

export const addAddress=(req,resp)=>{
    const user_id=req.params.id
    const {landmark,state,pincode,district,country,latitude="",longitude=""}=req.body
    // console.log("user id is:",userId);
    console.log("req.body",req.body);
    
    const sql="INSERT INTO address (user_id,landmark,state,pincode,district,country,latitude,longitude)   VALUES (?,?,?,?,?,?,?,?)"
    db.query(sql,[user_id,landmark,state,pincode,district,country,latitude,longitude],(err,result)=>{
        if(err){
             return resp.status(500).json({message:"server error",sussesss:false,error:err})
        }else{
            return resp.status(200).json({message:"address add succesfully",success:true})
        }
    })
    

}


export const getAddresById=(req,resp)=>{
    const user_id=req.params.id
    const sql="SELECT * FROM address WHERE user_id=?"
    db.query(sql,[user_id],(err,result)=>{
        if(err){
            return resp.status(500).json({message:"server error",error:err})
        }else{
            return resp.status(200).json({message:"Address get succesfuly",success:true,data:result})
        }
    })
}


// Update Address Controller
export const updateAddress = (req, resp) => {
  const user_id = req.params.id;
  const { landmark, state, pincode, district, country, latitude = "", longitude = "" } = req.body;

  const sql = `
    UPDATE address 
    SET landmark = ?, state = ?, pincode = ?, district = ?, country = ?, latitude = ?, longitude = ?
    WHERE user_id = ?
  `;

  db.query(sql, [landmark, state, pincode, district, country, latitude, longitude, user_id], (err, result) => {
    if (err) {
      return resp.status(500).json({ message: "Server error", success: false, error: err });
    }

    if (result.affectedRows === 0) {
      return resp.status(404).json({ message: "No address found for this user", success: false });
    }

    return resp.status(200).json({ message: "Address updated successfully", success: true });
  });
};





