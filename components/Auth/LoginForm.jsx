import InputField from "@components/ui/InputField";
import { useAuth } from "@contexts/AuthContext";
import { Form, Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import * as Yup from "yup";
import GoogleSignIn from "./GoogleSignIn";
import { useSnackbar } from "notistack";
import { Button, Stack, Link as MLink } from "@mui/material";
import { Box } from "@mui/system";

const LoginSchema = Yup.object().shape({
	email: Yup.string().email("Invalid Email").required("Required"),
	password: Yup.string().required("Required"),
});

const LoginForm = () => {
	const { logIn } = useAuth();
	const router = useRouter();
	const { redirect } = router.query;
	const { enqueueSnackbar } = useSnackbar();

	return (
		<Formik
			initialValues={{ email: "", password: "" }}
			validationSchema={LoginSchema}
			onSubmit={(values, actions) => {
				logIn(values.email, values.password)
					.then((userCredential) => {
						enqueueSnackbar("Logged In Successfully", { variant: "success" });
						actions.setSubmitting(false);
						console.log(userCredential);
						if (redirect) {
							router.push(redirect);
						}
					})
					.catch((error) => {
						actions.setSubmitting(false);
						enqueueSnackbar(error.message, { variant: "error" });
						console.error(error.message);
					});
			}}
		>
			{({ isSubmitting }) => (
				<Form>
					<Stack
						spacing={2}
						sx={{
							marginX: "8px",
						}}
					>
						<Box>
							<InputField
								name="email"
								label="Email"
								placeholder="Email"
								type="text"
								autoComplete="username"
							/>

							<InputField
								name="password"
								label="Password"
								placeholder="Password"
								type="password"
								autoComplete="current-password"
							/>
						</Box>

						<Link href="/auth/forgot-password">
							<MLink
								underline="hover"
								textAlign={"right"}
								sx={{ cursor: "pointer" }}
							>
								Forgot your Password ?
							</MLink>
						</Link>

						<Button variant="contained" type="submit">
							{isSubmitting ? "Loading" : "Sign In"}
						</Button>

						<GoogleSignIn />
					</Stack>
				</Form>
			)}
		</Formik>
	);
};

export default LoginForm;
