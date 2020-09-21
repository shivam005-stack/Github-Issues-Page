import React, { Component } from "react";
import axios from "axios";
import { toast, ToastContainer, Zoom } from "react-toastify";
import { trackPromise } from "react-promise-tracker";
import { Spinner } from "./Spinner";
import "../styles/AddIssueForm.css";
import "../styles/EditIssueForm.css";

class EditIssueForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userName: this.props.location.state.userName,
			data: this.props.location.state.data,
			isClosed: this.props.location.state.isClosed,
			submitButton: "UPDATE ISSUE",
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

		const { userName, data, isClosed } = this.state;
		const { id } = this.props.location.state;

		this.setState({ submitButton: "UPDATING ISSUE..." });

		trackPromise(
			axios
				.put(`/update-issue/${id}`, {
					userName,
					data,
					isClosed,
				})
				.then(resp => {
					toast.success(`UPDATED ISSUE SUCCESSFULLY`);
					this.setState({
						submitButton: "UPDATE ISSUE",
					});
				})
				.catch(err => {
					if (err && err.response && err.response.data) {
						toast.error(err.response.data.error);
					} else {
						toast.error(`Failed to update Issue`);
					}
					this.setState({ submitButton: "UPDATE ISSUE" });
				}),
			"update-issue"
		);
	};

	render() {
		const { userName, data, submitButton } = this.state;
		return (
			<div className="form-container form-container-1">
				<Spinner area="update-issue" />
				<ToastContainer draggable={false} transition={Zoom} autoClose={2000} />
				<abbr title="Back to Issues Page">
					<img
						src="https://img.icons8.com/fluent/80/000000/circled-left-2.png"
						className="back-button"
						alt="Back Button"
						onClick={this.backButton}
					/>
				</abbr>

				<div className="form-header">EDIT ISSUE</div>
				<form className="form-body" onSubmit={this.submitForm}>
					<input
						type="text"
						className="form-input"
						maxLength="32"
						name="userName"
						value={userName}
						placeholder="Enter name..."
						onChange={this.handleChange}
					/>
					<textarea
						className="form-input data-textarea"
						maxLength="60"
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

export default EditIssueForm;
