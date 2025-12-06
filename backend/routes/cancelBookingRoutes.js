const express = require("express");
const router = express.Router();

// Example cancel route (optional if already handled in bookingRoutes)
router.delete("/:id", (req, res) => {
  // Implement cancel logic or redirect to bookingRoutes logic
  res.json({ status: "success", message: "Cancel route placeholder" });
});

module.exports = router;
