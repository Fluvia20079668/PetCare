const express = require("express"); //express  the web framework used to handle http request
const router = express.Router();//a mini-router object to define endpoints(like /signup and login)
//this router will be connected to the main Express app.
const db = require("../db"); //db: databse connection module// run sql queries

// Signup : Handles POST requests sent to /signup // create new user in usert able
router.post
("/signup", (req, res) => 
  {
    const { name, email, password } = req.body;

    // Hash the password
    bcrypt.hash
    (
      password, saltRounds, (err, hashedPassword) => 
      {
        if (err) return res.json({ status: "error", error: err });

        // Store hashed password in database
        db.query
        (
          "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
          [name, email, hashedPassword],
          (err) => 
          {
            if (err) return res.json({ status: "error", error: err });
            res.json({ status: "success", message: "User created" });
           }
        );
      }  
    );
  }
);
// Login. // Handles POST requests sent to /login.
router.post
("/login", (req, res) => 
    {
      //It checks if there is a user with the given email and password.
      const { email, password } = req.body;
      db.query
      (
        "SELECT * FROM users WHERE email = ? AND password = ?",
        [email, password],
        (err, results) => 
        {
          if (err) return res.json({ status: "error", error: err });
          if (results.length === 0)
          return res.json({ status: "fail", message: "Invalid credentials" });
          res.json({ status: "success", user: results[0] });
        }
      );
    }
  );
module.exports = router;
