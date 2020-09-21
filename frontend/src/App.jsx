import React from "react";
import axios from "axios";
import "./styles/App.css";
import Routes from "./routes/Routes";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_URL;

function App() {
	return (
		<div className="App">
			<Routes></Routes>
		</div>
	);
}

export default App;
