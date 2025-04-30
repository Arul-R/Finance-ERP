const { createProxyMiddleware } = require("http-proxy-middleware");
const express = require("express");
const router = express.Router();

router.use(
  "/",
  createProxyMiddleware({
    target: process.env.EMPLOYEE_SERVICE,
    changeOrigin: true,
    pathRewrite: { "^/api/employees": "" },
  })
);

module.exports = router;
