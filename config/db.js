// import mysql from "mysql"
import mysql from "mysql"

const db = mysql.createConnection({
    host: 'localhost',
    user: "root",
    password: "",
    database: "blinkit"
})

db.connect((err) => {
    if (err) {
        console.log("db is not connected",);

    } else {
        console.log("DB is connected");

    }
})

export default db