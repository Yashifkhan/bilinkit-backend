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