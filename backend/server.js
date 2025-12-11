const express = require("express");
const cors = require("cors");
const app = express();

// -----------------------------
// CORS
// -----------------------------
// Allow requests from local dev AND your Netlify frontend
const allowedOrigins = [
  "http://localhost:3000",
  "https://693b4afa04c9360007542168--hilarious-donut-189de9.netlify.app"
];
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps or Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS not allowed"));
      }
    },
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
  console.log(`✅ Server running on port ${PORT}`)
);
