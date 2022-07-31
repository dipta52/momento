import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useAuth } from "@contexts/AuthContext";
import InputField from "@components/ui/InputField";
import Link from "next/link";
import { withAuthPages } from "@components/routes";

const ForgotPasswordSchema = Yup.object().shape({
	email: Yup.string().email("Invalid Email").required("Required"),
});

const ForgotPassword = () => {
	const { resetPassword } = useAuth();

	return (
		<Formik
			initialValues={{ email: "", password: "" }}
			validationSchema={ForgotPasswordSchema}
			onSubmit={(values, actions) => {
				resetPassword(values.email)
					.then(() => {
						console.log("Email Sent");
						actions.setSubmitting(false);
					})
					.catch((error) => {
						console.error(error);
						actions.setSubmitting(false);
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

						<Link href="/auth/login">Login ?</Link>

						<button type="submit">
							{isSubmitting ? "Loading" : "Send Reset Link"}
						</button>
					</div>
				</Form>
			)}
		</Formik>
	);
};

export default withAuthPages(ForgotPassword);
