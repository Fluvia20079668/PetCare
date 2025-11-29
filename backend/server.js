const express = require("express");
const cors = require("cors");
const app = express();

// -----------------------------
// CORS
// -----------------------------
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
  })
);

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

// USER ACCOUNT routes
app.use("/users", userRoutes);

// USER bookings (create + view)
app.use("/bookings", userBookingRoutes);

// Create booking
app.use("/book", bookingRoutes);

// Cancel a booking
app.use("/bookings/cancel", cancelBookingRoutes);

// ADMIN routes
app.use("/admin", adminRoutes);

// ADMIN booking routes — clean and isolated
app.use("/admin/bookings", adminBookingRoutes); 


// -----------------------------
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// -----------------------------
const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
