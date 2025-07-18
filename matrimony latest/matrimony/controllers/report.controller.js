const Report = require("../models/Report");

// Create a report
const createReport = async (req, res) => {
  const { reporter_id, reported_id, reason } = req.body;

  if (!reporter_id || !reported_id || !reason) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    const report = await Report.create({ reporter_id, reported_id, reason });
    res.status(201).json({ message: "Report submitted", report });
  } catch (error) {
    console.error("Create Report Error:", error.message);
    res.status(500).json({ message: "Failed to create report" });
  }
};

// Get unresolved reports
const getUnresolvedReports = async (req, res) => {
  try {
    const reports = await Report.findAll({ where: { status: "unresolved" } });
    res.status(200).json(reports);
  } catch (error) {
    console.error("Fetch Reports Error:", error.message);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};

// Resolve a report
const resolveReport = async (req, res) => {
  const { reportId } = req.params;

  try {
    const report = await Report.findByPk(reportId);
    if (!report) return res.status(404).json({ message: "Report not found" });

    report.status = "resolved";
    await report.save();

    res.status(200).json({ message: "Report marked as resolved" });
  } catch (error) {
    console.error("Resolve Report Error:", error.message);
    res.status(500).json({ message: "Failed to resolve report" });
  }
};

module.exports = {
  createReport,
  getUnresolvedReports,
  resolveReport,
};
