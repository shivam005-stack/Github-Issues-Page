const { model, Schema } = require("mongoose");

const IssueSchema = new Schema(
	{
		userName: {
			type: String,
			trim: true,
			required: true,
			max: 32,
		},
		data: {
			type: String,
			trim: true,
			required: true,
			unique: true,
			max: 64,
		},
		isClosed: {
			type: Boolean,
			default: false,
		},
		time: {
			type: String,
			default: new Date()
				.toLocaleString()
				.replace(",", "")
				.replace(/:.. /, " "),
		},
	},
	{ timestamps: true }
);

module.exports = model("Issue", IssueSchema);
