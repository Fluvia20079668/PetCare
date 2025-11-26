const bcrypt = require("bcrypt");

const hashInDB = "$2b$10$Z6r7P9WcYVv6CkqZlN8fWOoF2qk4vV2rK7s0Dgnxs2QfJQmP9sT8e"; 
const plainPassword = "admin123";

bcrypt.compare(plainPassword, hashInDB).then(match => {
  console.log("PASSWORD MATCH:", match);
});
