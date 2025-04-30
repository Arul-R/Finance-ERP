const { createProxyMiddleware } = require("http-proxy-middleware");
const express = require("express");
const router = express.Router();

router.use(
  "/",
  createProxyMiddleware({
    target: process.env.PROJECT_SERVICE,
    changeOrigin: true,
    pathRewrite: { "^/api/projects": "" },
  })
);

module.exports = router;
