const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/daycare", require("./routes/daycareRoutes"));
app.use("/api/hostel", require("./routes/hostelRoutes"));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});