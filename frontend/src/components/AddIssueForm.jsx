import React, { Component } from "react";
import axios from "axios";
import { toast, ToastContainer, Zoom } from "react-toastify";
import { trackPromise } from "react-promise-tracker";
import { Spinner } from "./Spinner";
import "../styles/AddIssueForm.css";

class AddIssueForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userName: "",
			data: "",
			submitButton: "ADD ISSUE",
		};
	}

	handleChange = e => {
		this.setState({
			...this.state,
			[e.target.name]: e.target.value,
		});
	};

	backButton = () => {
		this.props.history.push("/");
	};

	submitForm = e => {
		e.preventDefault();

		const { userName, data } = this.state;

		this.setState({ submitButton: "ADDING ISSUE..." });

		trackPromise(
			axios
				.post("/add-issue", {
					userName,
					data,
				})
				.then(resp => {
					toast.success(resp.data.message);
					this.setState({
						userName: "",
						data: "",
						submitButton: "ADD ISSUE",
					});
				})
				.catch(err => {
					if (err && err.response && err.response.data) {
						toast.error(err.response.data.error);
					} else {
						toast.error(`Failed to add Issue`);
					}
					this.setState({ submitButton: "ADD ISSUE" });
				}),
			"add-issue"
		);
	};

	render() {
		const { userName, data, submitButton } = this.state;
		return (
			<div className="form-container">
				<Spinner area="add-issue" />
				<ToastContainer draggable={false} transition={Zoom} autoClose={2000} />
				<abbr title="Back to Issues Page">
					<img
						src="https://img.icons8.com/fluent/80/000000/circled-left-2.png"
						className="back-button"
						alt="Back Button"
						onClick={this.backButton}
					/>
				</abbr>

				<div className="form-header">ADD NEW ISSUE</div>
				<form className="form-body" onSubmit={this.submitForm}>
					<input
						type="text"
						className="form-input"
						maxlength="32"
						name="userName"
						value={userName}
						placeholder="Enter name..."
						onChange={this.handleChange}
					/>
					<textarea
						className="form-input data-textarea"
						maxlength="60"
						name="data"
						value={data}
						placeholder="Enter issue..."
						onChange={this.handleChange}
					/>
					<input className="submit-button" type="submit" value={submitButton} />
				</form>
			</div>
		);
	}
}

export default AddIssueForm;
