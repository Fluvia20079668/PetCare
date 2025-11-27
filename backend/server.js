const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./db");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const userRoutes = require("./routes/userRoutes");
const daycareRoutes = require("./routes/daycareRoutes");
const hostelRoutes = require("./routes/hostelRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Use Routes
app.use("/api/users", userRoutes);
app.use("/api/daycare", require("./routes/daycarebooking"));
app.use("/api/hostel", require("./routes/hostelbooking"));
app.use("/api/admin", adminRoutes);


// Test Root Endpoint
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// Start Server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
