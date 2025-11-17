const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Flu@7575",
  database: "petcare"
});

db.connect(err => {
  if (err) console.log(err);
  else console.log("MySQL connected");
});

module.exports = db;
