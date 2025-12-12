const db = require("./db"); // your db pool
const bcrypt = require("bcrypt");

const email = process.argv[2]; // e.g. node setAdminPassword.js admin@petcare.com MyNewPass1!
const plain = process.argv[3];

//valiadte inputs
if (!email || !plain) {
  console.log("Usage: node setAdminPassword.js <email> <newPassword>");
  process.exit(1);
}
//hash the paasword and update the databse 
bcrypt.hash(plain, 10).then(hash => {
  db.query("UPDATE users SET password = ? WHERE email = ?", [hash, email], (err, result) => {
    if (err) {
      console.error("DB error:", err);
      process.exit(1);
    }
    console.log("Password updated for", email);
    process.exit(0);
  });
});
