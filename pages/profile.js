import { withProtected } from "@components/routes";
import { useAuth } from "@contexts/AuthContext";
import { useRouter } from "next/router";
import React from "react";

const ProfilePage = () => {
	const { currentUser, logOut } = useAuth();
	const router = useRouter();

	return (
		<>
			<h1>Profile</h1>
			<p>{JSON.stringify(currentUser, null, 4)}</p>

			<button
				onClick={() => {
					logOut()
						.then(() => {
							router.replace("/auth/login");
						})
						.catch((error) => {
							console.error(error);
						});
				}}
			>
				Logout
			</button>
		</>
	);
};

export default withProtected(ProfilePage);
