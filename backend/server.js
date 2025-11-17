const express = require("express");
const cors = require("cors");
const app = express();

const userRoutes = require("./routes/userRoutes");
const daycareRoutes = require("./routes/daycareRoutes");
const hostelRoutes = require("./routes/hostelRoutes");

app.use(cors());//enables CORS so frontend can access the API
app.use(express.json());// allows parsing JSON in request body

app.use("/api/users", userRoutes);
app.use("/api/daycare", daycareRoutes);
app.use("/api/hostel", hostelRoutes);

app.listen(8080, () => {
  console.log("Server running on port 8080");
});