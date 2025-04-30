const { createProxyMiddleware } = require("http-proxy-middleware");
const express = require("express");
const router = express.Router();

router.use(
  "/",
  createProxyMiddleware({
    target: process.env.CLIENT_SERVICE,
    changeOrigin: true,
    pathRewrite: { "^/api/clients": "" },
  })
);

module.exports = router;
