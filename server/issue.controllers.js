const Issue = require("./issue.schema");

exports.getNumberOfPages = (__, res) => {
	Issue.find({}).exec((err, issues) => {
		if (err) {
			return res.status(400).json({
				error: `Something went wrong ${err}`,
			});
		}

		res.json({ numOfPages: Math.ceil(issues.length / 5) });
	});
};

exports.getStatusNumberOfPages = (req, res) => {
	const { isClosed } = req.params;

	Issue.find({ isClosed }).exec((err, issues) => {
		if (err) {
			return res.status(400).json({
				error: `Something went wrong ${err}`,
			});
		}

		res.json({ numOfPages: Math.ceil(issues.length / 5) });
	});
};

exports.addIssue = (req, res) => {
	const { userName, data } = req.body;

	const newIssue = new Issue({ userName, data });

	Issue.findOne({ data }).exec((err, issue) => {
		if (err) {
			return res.status(400).json({
				error: `Something went wrong ${err}`,
			});
		}
		if (issue) {
			return res.status(400).json({
				error: `Issue with data "${issue.data}" already exists`,
			});
		}

		newIssue.save((err, issue) => {
			if (err) {
				return res.status(400).json({
					error: `Something went wrong ${err}`,
				});
			}

			res.json({
				message: `Hey, Issue: "${issue.data}" by User: "${issue.userName}" is Added`,
			});
		});
	});
};

exports.getAllIssues = (req, res) => {
	const { offset } = req.query;
	Issue.find({})
		.sort("-createdAt")
		.skip(parseInt(offset))
		.limit(5)
		.exec((err, issues) => {
			if (err) {
				return res.status(400).json({
					error: `Something went wrong ${err}`,
				});
			}

			return res.json({ issues: issues });
		});
};

exports.getStatusIssues = (req, res) => {
	const { offset } = req.query;
	const { isClosed } = req.params;
	Issue.find({
		isClosed,
	})
		.sort("-createdAt")
		.skip(parseInt(offset))
		.limit(5)
		.exec((err, issues) => {
			if (err) {
				return res.status(400).json({
					error: `Something went wrong ${err}`,
				});
			}

			return res.json({ issues: issues });
		});
};

exports.updateIssue = (req, res) => {
	const { id } = req.params;
	const { data, isClosed, userName } = req.body;

	Issue.updateOne(
		{ _id: id },
		{
			userName: userName,
			data: data,
			isClosed: isClosed,
		}
	).exec((err, update) => {
		if (err) {
			return res.status(400).json({
				error: "Issue with same data already exists",
			});
		}

		if (!update) {
			return res.status(400).json({
				error: "Specified Issue does not exist.",
			});
		}

		return res.json({ updated: update });
	});
};

exports.updateIssueStatus = (req, res) => {
	const { id } = req.params;
	const { isClosed } = req.body;

	Issue.updateOne(
		{ _id: id },
		{
			isClosed: isClosed,
		}
	).exec((err, update) => {
		if (err) {
			return res.status(400).json({
				error: "Something went wrong",
			});
		}

		if (!update) {
			return res.status(400).json({
				error: "Specified Issue does not exist.",
			});
		}

		return res.json({ updated: update });
	});
};

exports.deleteIssue = (req, res) => {
	const { id } = req.params;

	Issue.findOneAndDelete({ _id: id }).exec((err, deleted) => {
		if (err) {
			return res.status(400).json({
				error: "Something went wrong",
			});
		}

		if (!deleted) {
			return res.status(400).json({
				error: "Specified Issue does not exist.",
			});
		}

		return res.json({ deleted });
	});
};
