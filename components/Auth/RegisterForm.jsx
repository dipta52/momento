import InputField from "@components/ui/InputField";
import { useAuth } from "@contexts/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { db } from "../../firebase";

const RegisterSchema = Yup.object().shape({
	firstname: Yup.string().required("Required"),
	lastname: Yup.string().required("Required"),
	email: Yup.string().email("Invalid Email").required("Required"),
	password: Yup.string()
		.min(6, "Too Short")
		.max(30, "Too Long")
		.required("Required"),
});

const RegisterForm = () => {
	const { signUp, updateProfileDetails, sendVerificationEmail } = useAuth();

	return (
		<Formik
			initialValues={{
				firstname: "",
				lastname: "",
				email: "",
				password: "",
			}}
			validationSchema={RegisterSchema}
			onSubmit={async (values, actions) => {
				signUp(values.email, values.password)
					.then((userCredential) => {
						const user = userCredential.user;
						updateProfileDetails(
							user,
							`${values.firstname} ${values.lastname}`
						);
						setDoc(doc(db, "users", user.uid), {});
						actions.setSubmitting(false);
						sendVerificationEmail(user).then(() => {
							// router.push(
							// 	"/auth/verifyemail",
							// 	"/auth/verifyemail"
							// );
						});
					})
					.catch((error) => {
						actions.setSubmitting(false);
						console.error(error.message);
					});
			}}
		>
			{({ isSubmitting }) => (
				<Form>
					<InputField
						name="firstname"
						label="First Name"
						placeholder="First Name"
						type="text"
						autoComplete="firstname"
					/>
					<InputField
						name="lastname"
						label="Last Name"
						placeholder="Last Name"
						type="text"
						autoComplete="lastname"
					/>

					<InputField
						name="email"
						label="Email"
						placeholder="Email"
						type="email"
						autoComplete="email"
					/>
					<InputField
						name="password"
						label="Password"
						placeholder="Password"
						type="password"
						autoComplete="current-password"
					/>

					<button type="submit">{isSubmitting ? "Loading" : "Register"}</button>
				</Form>
			)}
		</Formik>
	);
};

export default RegisterForm;
