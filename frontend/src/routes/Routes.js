import React, { Component } from "react";
import { BrowserRouter, Switch, Redirect, Route } from "react-router-dom";
import AddIssueForm from "./../components/AddIssueForm";
import IssuesPage from "./../components/IssuesPage";
import EditIssueForm from "./../components/EditIssueForm";

class Routes extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<BrowserRouter>
				<Switch>
					<Route exact path="/add-issue" component={AddIssueForm} />
					<Route exact path="/edit-issue" component={EditIssueForm} />
					<Route exact path="/page/:pageNumber" component={IssuesPage} />
					<Redirect to="/page/1" component={IssuesPage}></Redirect>
				</Switch>
			</BrowserRouter>
		);
	}
}

export default Routes;
