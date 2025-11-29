// GET ALL BOOKINGS (MERGED)
router.get("/bookings", (req, res) => {
  const queries = [
    { type: "daycare", sql: "SELECT d.*, u.name AS user_name FROM daycare_bookings d JOIN users u ON d.user_id = u.id" },
    { type: "hostel", sql: "SELECT h.*, u.name AS user_name FROM hostel_bookings h JOIN users u ON h.user_id = u.id" },
    { type: "grooming", sql: "SELECT g.*, u.name AS user_name FROM grooming_bookings g JOIN users u ON g.user_id = u.id" },
    { type: "walking", sql: "SELECT w.*, u.name AS user_name FROM walking_bookings w JOIN users u ON w.user_id = u.id" },
    { type: "checkup", sql: "SELECT c.*, u.name AS user_name FROM checkup_bookings c JOIN users u ON c.user_id = u.id" },
    { type: "food", sql: "SELECT f.*, u.name AS user_name FROM food_bookings f JOIN users u ON f.user_id = u.id" }
  ];

  let results = [];
  let count = 0;

  queries.forEach(q => {
    db.query(q.sql, (err, rows) => {
      count++;

      if (!err && rows.length > 0) {
        rows.forEach(r => {
          r.type = q.type;
          results.push(r);
        });
      }

      // When all queries have finished
      if (count === queries.length) {
        res.json({
          status: "success",
          bookings: results
        });
      }
    });
  });
});
