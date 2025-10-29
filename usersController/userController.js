import db from "../config/db.js";
import bcrypt from "bcrypt"
import { transporter } from "../middlewares/imageMiddleware.js";

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
    db.query(sql, [name, email, hashedPassword, phone], async (err, result) => {
      if (err) {
        console.error("DB Error:", err);
        return resp.status(500).json({
          message: "Server error",
          success: false,
          error: err
        });
      }


      const registerEmail = {
        from: `"Blinkit" <${process.env.SENDER_EMAIL}>`,
        to: email,
        subject: "🎉 Welcome to Blinkit - Your Account is Ready!",
        text: `Welcome to Blinkit! Your account has been successfully created. Start shopping now and get instant delivery in minutes.`,
        html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .alert-box { background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .feature-box { background: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 15px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 13px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to Blinkit!</h1>
        </div>
        
        <div class="content">
          <h2>Hi ${name || 'there'}! 👋</h2>
          
          <div class="alert-box">
            <strong>✅ Account Created Successfully</strong>
            <p>Your Blinkit account has been created on <strong>${new Date().toLocaleString()}</strong></p>
          </div>
          
          <p>We're excited to have you join the Blinkit family!</p>
          
          <p><strong>Your Account Details:</strong></p>
          <p>📧 Email: ${email}</p>
          <p>📅 Registration Date: ${new Date().toLocaleDateString()}</p>
          
          <div class="feature-box">
            <strong>🚀 What you can do now:</strong>
            <p>✅ Browse thousands of products</p>
            <p>✅ Get delivery in 10-15 minutes</p>
            <p>✅ Enjoy exclusive deals & offers</p>
            <p>✅ Track orders in real-time</p>
          </div>
          
          <center>
            <a href="https://yourapp.com" class="button">Start Shopping Now</a>
          </center>
          
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            Need help? Our support team is available 24/7.
          </p>
        </div>
        
        <div class="footer">
          <p>© 2025 Blinkit. All rights reserved.</p>
          <p>Need help? Contact us at support@blinkit.com</p>
        </div>
      </div>
    </body>
    </html>
  `
      };
      const message = await transporter.sendMail(registerEmail)
      console.log("message user register", message);

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

          const shopkeeperRegisterEmail = {
            from: `"Blinkit Partner" <${process.env.SENDER_EMAIL}>`,
            to: email,
            subject: "🏪 Welcome to Blinkit Partners - Your Store is Ready!",
            text: `Welcome to Blinkit Partners! Your seller account has been successfully created. Start managing your store and reach thousands of customers.`,
            html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .alert-box { background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .feature-box { background: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .button { display: inline-block; padding: 12px 30px; background: #FF6B6B; color: white; text-decoration: none; border-radius: 5px; margin: 15px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 13px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏪 Welcome to Blinkit Partners!</h1>
        </div>
        
        <div class="content">
          <h2>Hi ${shopName || 'Shop Owner'}! 👋</h2>
          
          <div class="alert-box">
            <strong>✅ Seller Account Created Successfully</strong>
            <p>Your Blinkit partner account has been activated on <strong>${new Date().toLocaleString()}</strong></p>
          </div>
          
          <p>Congratulations! You're now part of the Blinkit seller network.</p>
          
          <p><strong>Your Store Details:</strong></p>
          <p>📧 Email: ${email}</p>
          <p>🏪 Store Name: ${shopName || 'Your Store'}</p>
          <p>📅 Registration Date: ${new Date().toLocaleDateString()}</p>
          
          <div class="feature-box">
            <strong>🚀 Next Steps:</strong>
            <p>✅ Add your products to the inventory</p>
            <p>✅ Set up your store timings</p>
            <p>✅ Configure delivery zones</p>
            <p>✅ Start receiving orders</p>
            <p>✅ Track sales & analytics</p>
          </div>
          
          <center>
            <a href="https://yourapp.com/seller/dashboard" class="button">Go to Seller Dashboard</a>
          </center>
          
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            Need help getting started? Check our seller guide or contact our partner support team.
          </p>
        </div>
        
        <div class="footer">
          <p>© 2025 Blinkit Partners. All rights reserved.</p>
          <p>Partner Support: seller-support@blinkit.com | 📞 1800-XXX-XXXX</p>
        </div>
      </div>
    </body>
    </html>
              `
          };

          const isEmailSent = await transporter.sendMail(shopkeeperRegisterEmail);
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

      const isLogin = {
        from: `"Blinkit" <${process.env.SENDER_EMAIL}>`,
        to: email,
        subject: "🔐 New Login to Your Blinkit Account",
        text: `Hi! We detected a new login to your Blinkit account. If this wasn't you, please secure your account immediately.`,
        html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .alert-box { background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .warning-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .button { display: inline-block; padding: 12px 30px; background: #dc3545; color: white; text-decoration: none; border-radius: 5px; margin: 15px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 13px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Security Alert</h1>
        </div>
        
        <div class="content">
          <h2>Hi there! 👋</h2>
          
          <div class="alert-box">
            <strong>✅ Login Successful</strong>
            <p>Your Blinkit account was accessed on <strong>${new Date().toLocaleString()}</strong></p>
          </div>
          
          <p><strong>Login Details:</strong></p>
          <p>📧 Email: ${email}</p>
          <p>📅 Time: ${new Date().toLocaleString()}</p>
          <p>📍 Location: Delhi, India</p>
          
        
          
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            If this was you, you can safely ignore this email.
          </p>
        </div>
        
        <div class="footer">
          <p>© 2025 Blinkit. All rights reserved.</p>
          <p>Need help? Contact us at support@blinkit.com</p>
        </div>
      </div>
    </body>
    </html>
  `
      };
      const logged = await transporter.sendMail(isLogin)
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




