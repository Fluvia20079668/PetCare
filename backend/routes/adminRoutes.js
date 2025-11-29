const express = require("express");
const router = express.Router();
const db = require("../db");

// ========== ADMIN LOGIN ==========
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (email === "admin@gmail.com" && password === "admin123") {
        return res.json({ status: "success", message: "Admin login success" });
    } else {
        return res.json({ status: "error", message: "Invalid admin credentials" });
    }
});

// ========== FETCH ALL BOOKINGS ==========
router.get("/bookings", async (req, res) => {
    try {
        const daycare = await db.query("SELECT * FROM daycare_bookings");
        const hostel = await db.query("SELECT * FROM hostel_bookings");
        const grooming = await db.query("SELECT * FROM grooming_bookings");
        const walking = await db.query("SELECT * FROM walking_bookings");
        const vet = await db.query("SELECT * FROM vetcheck_bookings");
        const food = await db.query("SELECT * FROM food_orders");

        return res.json({
            status: "success",
            bookings: {
                daycare: daycare[0],
                hostel: hostel[0],
                grooming: grooming[0],
                walking: walking[0],
                vetcheck: vet[0],
                food: food[0],
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: "error", message: "Failed to load bookings" });
    }
});

// ========== CANCEL BOOKING (ANY SERVICE) ==========
router.delete("/cancel/:service/:id", async (req, res) => {
    const { service, id } = req.params;

    const tables = {
        daycare: "daycare_bookings",
        hostel: "hostel_bookings",
        grooming: "grooming_bookings",
        walking: "walking_bookings",
        vetcheck: "vetcheck_bookings",
        food: "food_orders"
    };

    if (!tables[service]) {
        return res.status(400).json({ status: "error", message: "Invalid service" });
    }

    try {
        await db.query(`DELETE FROM ${tables[service]} WHERE id = ?`, [id]);
        return res.json({ status: "success", message: "Booking cancelled" });
    } catch (err) {
        return res.status(500).json({ status: "error", message: "Cancellation failed" });
    }
});

module.exports = router;
