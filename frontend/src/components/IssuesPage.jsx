import React, { Component } from "react";
import axios from "axios";
import "../styles/IssuesPage.css";
import { toast, ToastContainer, Zoom } from "react-toastify";
import { trackPromise } from "react-promise-tracker";
import { Spinner } from "./Spinner";

class IssuesPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			issues: [],
			numOfPages: [],
		};
	}

	redirect = () => {
		this.props.history.push("/add-issue");
	};

	pageChange = e => {
		const pageNumber = e.target.id;

		this.props.history.push(`/page/${pageNumber}`);
	};

	getSnapshotBeforeUpdate(prevProps) {
		return {
			notifyRequired:
				prevProps.match.params.pageNumber !==
				this.props.match.params.pageNumber,
		};
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (snapshot.notifyRequired) {
			this.loadPage();
		}
	}

	componentDidMount() {
		this.getNumOfPages();
	}

	getNumOfPages = () => {
		let { numOfPages } = this.state;
		while (numOfPages.length !== 0) {
			numOfPages.pop();
		}
		trackPromise(
			axios
				.get("/num-of-pages")
				.then(resp => {
					for (let i = 1; i <= resp.data.numOfPages; i++) {
						numOfPages.push(i);
					}
					this.setState({
						...this.state,
						numOfPages,
					});
					this.loadPage();
				})
				.catch(err => {
					toast.error(`Failed to get data from Database`);
				}),
			"get-num-of-pages"
		);
	};

	getStatusNumOfPages = isClosed => {
		let { numOfPages } = this.state;
		while (numOfPages.length !== 0) {
			numOfPages.pop();
		}
		trackPromise(
			axios
				.get(`/${isClosed}/num-of-pages`)
				.then(resp => {
					for (let i = 1; i <= resp.data.numOfPages; i++) {
						numOfPages.push(i);
					}
					this.setState({
						...this.state,
						numOfPages,
					});
				})
				.catch(err => {
					toast.error(`Failed to get data from Database`);
				}),
			"get-num-of-pages"
		);
	};

	loadPage = () => {
		const { pageNumber } = this.props.match.params;
		trackPromise(
			axios
				.get(`/list-issues?offset=${(pageNumber - 1) * 5}`)
				.then(resp => {
					this.setState({
						issues: resp.data.issues,
					});
				})
				.catch(() => {
					toast.error(`Failed to get data from Database`);
				}),
			"get-issues"
		);
	};

	deleteIssue = e => {
		const { id } = e.target;

		trackPromise(
			axios
				.delete(`/delete-issue/${id}`)
				.then(resp => {
					toast.success(
						`Issue "${resp.data.deleted.data}" deleted successfully`
					);
					this.getNumOfPages();
				})
				.catch(() => {
					toast.error(`Failed to delete Issue`);
				}),
			"delete-issue"
		);
	};

	editIssue = e => {
		const { issues } = this.state;
		const { id } = e.target;

		const index = issues.findIndex(issue => issue._id === id);

		this.props.history.push({
			pathname: "/edit-issue",
			state: {
				id,
				userName: issues[index].userName,
				data: issues[index].data,
				isClosed: issues[index].isClosed,
			},
		});
	};

	updateStatus = e => {
		const status = e.target.options[e.target.value].innerHTML;
		const id = e.target.id;

		const isClosed = status === "Open" ? false : true;

		trackPromise(
			axios
				.put(`/update-issue-status/${id}`, {
					isClosed,
				})
				.then(resp => {
					toast.success(`UPDATED ISSUE SUCCESSFULLY`);
				})
				.catch(err => {
					if (err && err.response && err.response.data) {
						toast.error(err.response.data.error);
					} else {
						toast.error(`Failed to update Issue`);
					}
				}),
			"update-issue-status"
		);
	};

	changeFilter = e => {
		const { pageNumber } = this.props.match.params;
		let isClosed = false;
		let filter = e.target.id;
		if (filter === "ALL") {
			this.getNumOfPages();
		} else {
			isClosed = filter === "OPEN" ? false : true;

			this.getStatusNumOfPages(isClosed);

			trackPromise(
				axios
					.get(`/${isClosed}/list-issues?offset=${(pageNumber - 1) * 5}`)
					.then(resp => {
						this.setState({
							issues: resp.data.issues,
						});
					})
					.catch(() => {
						toast.error(`Failed to get data from Database`);
					}),
				"get-status-issues"
			);
		}
	};

	render() {
		const { issues, numOfPages } = this.state;
		return (
			<div className="issues-page-container">
				<div className="header">GITHUB ISSUES PAGE :</div>
				<Spinner area="get-issues" />
				<Spinner area="get-num-of-pages" />
				<Spinner area="delete-issue" />
				<Spinner area="get-status-issues" />
				<Spinner area="update-issue-status" />
				<ToastContainer draggable={false} transition={Zoom} autoClose={2000} />

				<div className="add-button-container">
					<button className="add-button" onClick={this.redirect}>
						ADD NEW ISSUE
					</button>
					<div className="filter-buttons-container">
						<button
							className="status-button"
							id="ALL"
							onClick={this.changeFilter}>
							ALL
						</button>
						<button
							className="status-button"
							id="OPEN"
							onClick={this.changeFilter}>
							OPEN
						</button>
						<button
							className="status-button"
							id="CLOSED"
							onClick={this.changeFilter}>
							CLOSED
						</button>
					</div>
				</div>

				<div className="all-issues-container">
					{issues.map(issue => (
						<div key={issue._id} className="issue-body">
							<div className="issue-exclamation">
								<img src="https://img.icons8.com/emoji/28/000000/exclamation-mark-emoji.png" />
							</div>
							<div className="issue-data">{issue.data}</div>
							<div className="issue-username-dropdown-wrapper">
								<div className="issue-username">{issue.userName}</div>

								<select
									name="status"
									className="status-dropdown-menu"
									id={issue._id}
									onChange={this.updateStatus}>
									<option value="0" selected={issue.isClosed ? "selected" : ""}>
										Close
									</option>
									<option
										value="1"
										selected={!issue.isClosed ? "selected" : ""}>
										Open
									</option>
								</select>
							</div>

							<div className="file-time">{issue.time}</div>
							<abbr title="Delete">
								<img
									id={issue._id}
									src="https://img.icons8.com/flat_round/20/000000/delete-sign.png"
									alt="delete logo"
									className="file-delete-icon"
									onClick={this.deleteIssue}
								/>
							</abbr>
							<abbr title="Edit">
								<img
									src="https://img.icons8.com/cotton/25/000000/edit--v1.png"
									id={issue._id}
									alt="delete logo"
									className="file-delete-icon edit-icon"
									onClick={this.editIssue}
								/>
							</abbr>
						</div>
					))}
				</div>
				<div className="pagenation-container">
					{numOfPages.map(num => (
						<div
							key={num}
							id={num}
							className="page-number"
							onClick={this.pageChange}>
							{num}
						</div>
					))}
				</div>
			</div>
		);
	}
}

export default IssuesPage;
