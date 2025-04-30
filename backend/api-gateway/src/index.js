require("dotenv").config();
const express = require("express");
const cors = require("cors");

const employeeRoutes = require("./routes/employeeRoutes");
const projectRoutes = require("./routes/projectRoutes");
const payrollRoutes = require("./routes/payrollRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Use routes
app.use("/api/employees", employeeRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/payroll", payrollRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
