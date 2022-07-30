import { useAuth } from "@contexts/AuthContext";
import React from "react";

const GoogleSignIn = () => {
	const { signInWithGoogle } = useAuth();

	return (
		<button
			type="button"
			onClick={() => {
				signInWithGoogle()
					.then((userCredential) => {
						console.log(userCredential.user);
					})
					.catch((error) => {
						console.error(error.message);
					});
			}}
		>
			Sign in with Google
		</button>
	);
};

export default GoogleSignIn;
