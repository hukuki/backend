const express = require("express");

const router = express.Router();

// Path: backend/router/user.js
router.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = router;