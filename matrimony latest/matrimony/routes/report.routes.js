const express = require('express');
const { createReport, getUnresolvedReports, resolveReport } = require("../controllers/report.controller.js");

const router = express.Router();

router.post("/", createReport);
router.get("/unresolved", getUnresolvedReports);
router.patch("/:reportId/resolve", resolveReport);

module.exports = router;
