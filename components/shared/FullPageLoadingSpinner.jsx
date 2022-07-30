import { LoadingSpinner } from "./LoadingSpinner";

const FullPageLoadingSpinner = () => {
	return (
		<div
			style={{
				display: "grid",
				placeItems: "center",
				height: "100vh",
			}}
		>
			<LoadingSpinner />
		</div>
	);
};

export default FullPageLoadingSpinner;
