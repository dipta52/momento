import { useAuth } from "@contexts/AuthContext";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { FcGoogle } from "react-icons/fc";

const GoogleSignIn = () => {
	const { signInWithGoogle } = useAuth();
	const { enqueueSnackbar } = useSnackbar();

	const router = useRouter();

	return (
		<Button
			type="button"
			variant="outlined"
			startIcon={<FcGoogle />}
			onClick={() => {
				signInWithGoogle()
					.then((userCredential) => {
						console.log(userCredential.user);
						enqueueSnackbar("Logged In Successfully", { variant: "success" });
						router.query.redirect = "/auth/create-user";
					})
					.catch((error) => {
						console.error(error.message);
						enqueueSnackbar(error.message, { variant: "error" });
					});
			}}
		>
			Continue with Google
		</Button>
	);
};

export default GoogleSignIn;
