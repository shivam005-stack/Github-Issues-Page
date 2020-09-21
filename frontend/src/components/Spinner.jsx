import React from "react";
import { usePromiseTracker } from "react-promise-tracker";
import Loader from "react-loader-spinner";
import "../styles/Spinner.css";

export const Spinner = props => {
	const { promiseInProgress } = usePromiseTracker({
		area: props.area,
		delay: 0,
	});

	return (
		promiseInProgress && (
			<div className="spinner">
				<Loader type="ThreeDots" color="#2BAD60" height="100" width="100" />
			</div>
		)
	);
};
