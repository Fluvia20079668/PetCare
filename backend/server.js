// backend/server.js (adjusted)
const express = require("express");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization"
}));
app.use(express.json());

// routes (unchanged)
const userRoutes = require("./routes/userRoutes");
const daycareRoutes = require("./routes/daycareRoutes");
const hostelRoutes = require("./routes/hostelRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/users", userRoutes);
app.use("/daycare", daycareRoutes);
app.use("/hostel", hostelRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => res.send("Backend is running..."));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
