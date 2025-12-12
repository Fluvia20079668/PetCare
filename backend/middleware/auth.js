//loads the jsonwetoken library where this lib use to verify and decode the JWT token
const jwt = require("jsonwebtoken");


//export the middleware funtion/read the authorization header/extract the token
module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  
  if (!token) return res.status(401).json({ status: "error", error: "No token provided" });

  //get the secert key 
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("Missing JWT_SECRET");
    return res.status(500).json({ status: "error", error: "Server config error" });
  }
//Try verifyting the token
  try {
    const payload = jwt.verify(token, secret);
    // check if user is an admin if can  acess to route
    if (!payload || !payload.isAdmin) {
      return res.status(403).json({ status: "error", error: "Not authorized" });
    }
    //admin data available to the next route handler. 
    req.admin = payload;
    next();  //middleware passed, go to the next function
  } catch (err) {
    return res.status(401).json({ status: "error", error: "Invalid token" });
  }
};   
