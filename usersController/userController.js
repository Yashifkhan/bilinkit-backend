import db from "../config/db.js";
import bcrypt from "bcrypt"
import nodemailer from "nodemailer"
// import { transporter } from "../middlewares/imageMiddleware.js";

export const registerUser = async (req, resp) => {
  const { name, email, password, phone, role, shop_name, shop_address, category } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10)
  if (role === "user") {
    if (!name || !email || !password || !phone) {
      return resp
        .status(400)
        .json({ message: "All fields are required", success: false });
    }
    const sql = "INSERT INTO users (name,email,password,phone,role) VALUES (?,?,?,?,'user') ";
    db.query(sql, [name, email, hashedPassword, phone], (err, result) => {
      if (err) {
        console.error("DB Error:", err);
        return resp.status(500).json({
          message: "Server error",
          success: false,
          error: err
        });
      }

      return resp.status(201).json({
        message: "Registered successfully",
        success: true,
        data: result,
      });
    });


  } else {
    if (!name || !email || !password || !phone) {
      return resp.status(400).json({ message: "all filds are required", success: false })
    }
    const sql =
      "INSERT INTO users (name,email,password,phone,role) VALUES (?,?,?,?,'shopkeeper')";

    db.query(sql, [name, email, password, phone], async (err, result) => {
      if (err) {
        console.error("DB Error:", err);
        return resp.status(500).json({
          message: "Server error",
          success: false,
          error: err,
        });
      }

      const shopkeeperId = result.insertId;

      const shopSql = ` INSERT INTO shopkeeper (shopkeeper_id, name, phone, shop_name, shop_address, category) VALUES (?, ?, ?, ?, ?, ?) `;

      db.query(shopSql, [shopkeeperId, name, phone, shop_name, shop_address, category], async (err, shopResult) => {
        if (err) {
          console.error("DB Error:", err);
          return resp.status(500).json({ message: "Error while registering shopkeeper", error: err, });
        } else {


          const emailOption = {
            from: "yashifyashifkhan@gmail.com",
            to: email,
            subject: "Hello jii kase ho sare!",
            text: "i am nodemailer",
            html: `<p>Hiii ${email}, have a good day  \n resgister succesfully </p>`,
          }

          const isEmailSent = await transporter.sendMail(emailOption)
          console.log("isemailsent", isEmailSent);


          return resp.status(201).json({
            message: "Shopkeeper registered successfully & request sent to admin",
            success: true,
            userId: shopkeeperId,
            shopkeeperId: shopResult.insertId,
          });
        }
      }
      );
    });
  }
};







export const loginUser = async (req, resp) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return resp.status(400).json({
      message: "Email and password required",
      success: false
    });
  }

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, result) => {
    if (err) {
      return resp.status(500).json({
        message: "Database error",
        error: err,
        success: false
      });
    }

    if (result.length === 0) {
      return resp.status(404).json({
        message: "Email not found. Please register first",
        success: false
      });
    }

    const user = result[0];
    // console.log("user",user);
    console.log("costumer passs", password);
    const isMatch = await bcrypt.compare(password, user.password)

    console.log("is match value is", isMatch);




    if (isMatch || user.password === password) {



      const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.SENDER_EMAIL,
          pass: process.env.SMTP_PASS,
        },
      });


      console.log("process.env.SENDER_EMAIL", process.env.SENDER_EMAIL);
      console.log("process.env.SMTP_PASS", process.env.SMTP_PASS);
      console.log("process.env.SMTP_USER", process.env.SMTP_USER);



      const isLogin = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Hello jii kase ho sare!",
        text: "i am nodemailer",
        html: "<p>Hiii ${email}, login succesfully </p>",
      }

      const logged = await transporter.sendMail(isLogin)
      console.log("logged", logged);



      return resp.status(200).json({
        message: "Login successful", success: true, data: { id: user.id, name: user.name, email: user.email, role: user.role }
      });
    } else {




      return resp.status(401).json({
        message: "Invalid password. Login failed",
        success: false
      });
    }
  });
};




