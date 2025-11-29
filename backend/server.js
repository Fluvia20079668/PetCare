// backend/server.js
const express = require("express");
const cors = require("cors");
const app = express();

// -----------------------------
// CORS (VERY IMPORTANT)
// -----------------------------
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -----------------------------
// ROUTES
// -----------------------------
const userRoutes = require("./routes/userRoutes");
const daycareRoutes = require("./routes/daycareRoutes");
const hostelRoutes = require("./routes/hostelRoutes");
const adminRoutes = require("./routes/adminRoutes");
const groomingRoutes = require("./routes/groomingRoutes");
const walkingRoutes = require("./routes/walkingRoutes");
const vetcheckRoutes = require("./routes/vetcheckRoutes");
const foodRoutes = require("./routes/foodRoutes");


app.use("/users", userRoutes);
app.use("/daycare", daycareRoutes);
app.use("/hostel", hostelRoutes);
app.use("/admin", adminRoutes);
app.use("/grooming", groomingRoutes);
app.use("/walking", walkingRoutes);
app.use("/vetcheck", vetcheckRoutes);
app.use("/food", foodRoutes);


// -----------------------------
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// -----------------------------
// SERVER
// -----------------------------
const PORT = process.env.PORT || 8080; 
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
