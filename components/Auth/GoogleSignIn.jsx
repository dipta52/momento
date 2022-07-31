import { useAuth } from "@contexts/AuthContext";
import { useRouter } from "next/router";

const GoogleSignIn = () => {
	const { signInWithGoogle } = useAuth();

	const router = useRouter();

	return (
		<button
			type="button"
			onClick={() => {
				signInWithGoogle()
					.then((userCredential) => {
						console.log(userCredential.user);
						router.query.redirect = "/auth/create-user";
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
