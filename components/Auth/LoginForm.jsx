import InputField from "@components/ui/InputField";
import { useAuth } from "@contexts/AuthContext";
import { Form, Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import * as Yup from "yup";
import GoogleSignIn from "./GoogleSignIn";

const LoginSchema = Yup.object().shape({
	email: Yup.string().email("Invalid Email").required("Required"),
	password: Yup.string().required("Required"),
});

const LoginForm = () => {
	const { logIn } = useAuth();
	const router = useRouter();
	const { redirect } = router.query;

	return (
		<Formik
			initialValues={{ email: "", password: "" }}
			validationSchema={LoginSchema}
			onSubmit={(values, actions) => {
				logIn(values.email, values.password)
					.then((userCredential) => {
						actions.setSubmitting(false);
						console.log(userCredential);
						if (redirect) {
							router.push(redirect);
						}
					})
					.catch((error) => {
						actions.setSubmitting(false);
						console.error(error.message);
					});
			}}
		>
			{({ isSubmitting }) => (
				<Form>
					<div>
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

						<Link href="/auth/forgot-password">Forgot your Password ?</Link>

						<button type="submit">
							{isSubmitting ? "Loading" : "Sign In"}
						</button>

						<GoogleSignIn />
					</div>
				</Form>
			)}
		</Formik>
	);
};

export default LoginForm;
