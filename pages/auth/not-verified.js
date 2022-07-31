import { withProtected } from "@components/routes";
import FullPageLoadingSpinner from "@components/shared/FullPageLoadingSpinner";
import { useAuth } from "@contexts/AuthContext";
import { useRouter } from "next/router";
import React from "react";

const NotVerifiedPage = () => {
	const router = useRouter();
	const { currentUser, sendVerificationEmail } = useAuth();

	if (currentUser.emailVerified) {
		router.replace("/");
		return <FullPageLoadingSpinner />;
	}

	return (
		<>
			<h1>Email Not Verified !</h1>
			<p>Verification Status : {currentUser.emailVerified.toString()}</p>

			<button onClick={() => sendVerificationEmail()}>
				Send Verification Email
			</button>

			<button onClick={() => router.reload()}>Already Verified</button>
		</>
	);
};

export default withProtected(NotVerifiedPage);
