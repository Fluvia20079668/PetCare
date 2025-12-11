const mysql = require("mysql2");

/*----  MY local DB credentials----
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "MyNewStrongPassword!",
  database: "petcare",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}); ----*/

// Use Railway environment variables if available, fallback to local for dev
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "MyNewStrongPassword!",
  database: process.env.MYSQL_DATABASE || "petcare",
  port: process.env.MYSQL_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection((err, conn) => {
  if (err) {
    console.error("❌ MySQL Connection Error:", err);
  } else {
    console.log("✅ MySQL connected (POOL)");
    conn.release();
  }
});

module.exports = pool;
