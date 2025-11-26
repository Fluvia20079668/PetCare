const express = require("express");
const cors = require("cors");
const app = express();

// Connect to MySQL
require("./db.js");

const userRoutes = require("./routes/userRoutes");
const daycareRoutes = require("./routes/daycareRoutes");
const hostelRoutes = require("./routes/hostelRoutes");

app.use(cors());//enables CORS so frontend can access the API
app.use(express.json());// allows parsing JSON in request body
//// API routes
app.use("/api/users", userRoutes);
app.use("/api/daycare", daycareRoutes);
app.use("/api/hostel", hostelRoutes);
app.use("/api/bookings", bookingsRoutes);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});