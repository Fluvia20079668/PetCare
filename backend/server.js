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
const adminRoutes = require("./routes/adminRoutes");
const adminBookingRoutes = require("./routes/adminBookingRoutes");
const userBookingRoutes = require("./routes/userBookingRoutes");
const cancelBookingRoutes = require("./routes/cancelBookingRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

app.use("/bookings", cancelBookingRoutes);
app.use("/book", bookingRoutes);
app.use("/bookings", userBookingRoutes);
app.use("/admin", adminBookingRoutes);
app.use("/users", userRoutes);
app.use("/admin", adminRoutes);


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
