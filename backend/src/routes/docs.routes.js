const express = require("express");
const docsController = require("../controllers/docs.controller");

const router = express.Router();

router.post("/ask", docsController.ask);

module.exports = router;
