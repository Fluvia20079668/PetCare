const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Flu@7575",
});

db.connect(err => {
  if (err) console.log("❌ ERROR:", err);
  else console.log("✅ Connected!");
});
