const { createProxyMiddleware } = require("http-proxy-middleware");
const express = require("express");
const router = express.Router();

router.use(
  "/",
  createProxyMiddleware({
    target: process.env.PAYROLL_SERVICE,
    changeOrigin: true,
    pathRewrite: { "^/api/payroll": "" },
  })
);

module.exports = router;
