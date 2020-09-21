const express = require("express");
const {
	addIssue,
	getStatusIssues,
	updateIssue,
	deleteIssue,
	getNumberOfPages,
	updateIssueStatus,
	getAllIssues,
	getStatusNumberOfPages,
} = require("./issue.controllers");
const router = express.Router();

router.post("/add-issue", addIssue);
router.get("/list-issues", getAllIssues);
router.get("/:isClosed/list-issues", getStatusIssues);
router.get("/num-of-pages", getNumberOfPages);
router.get("/:isClosed/num-of-pages", getStatusNumberOfPages);
router.put("/update-issue/:id", updateIssue);
router.put("/update-issue-status/:id", updateIssueStatus);
router.delete("/delete-issue/:id", deleteIssue);

module.exports = router;
