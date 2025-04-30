require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const payrollRoutes = require("./routes/payrollRoutes");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/payroll", payrollRoutes);

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => console.log(`Payroll service running on port ${PORT}`));
