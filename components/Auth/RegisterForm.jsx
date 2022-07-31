import FullPageLoadingSpinner from "@components/shared/FullPageLoadingSpinner";
import InputField from "@components/ui/InputField";
import { useAuth } from "@contexts/AuthContext";
import { collection, doc, onSnapshot, query, setDoc } from "firebase/firestore";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { db } from "../../firebase";

const RegisterForm = () => {
	const router = useRouter();
	const { redirect } = router.query;
	const { signUp, updateProfileDetails, sendVerificationEmail, currentUser } =
		useAuth();

	const [usernames, setUsernames] = useState([]);

	const RegisterSchema = Yup.object().shape({
		firstname: Yup.string().required("Required"),
		lastname: Yup.string().required("Required"),
		email: Yup.string().email("Invalid Email").required("Required"),
		password: Yup.string()
			.min(6, "Too Short")
			.max(30, "Too Long")
			.required("Required"),
		username: Yup.string()
			.min(3, "Too Short")
			.max(30, "Too Long")
			.required("Required")
			.notOneOf(usernames, "Already Taken"),
	});

	useEffect(
		() =>
			onSnapshot(query(collection(db, "usernames")), (snapshot) => {
				setUsernames(snapshot.docs.map((doc) => doc.id));
			}),
		[]
	);

	if (currentUser) {
		router.replace(redirect || "/");
		return <FullPageLoadingSpinner />;
	}

	return (
		<Formik
			initialValues={{
				firstname: "",
				lastname: "",
				username: "",
				email: "",
				password: "",
			}}
			validationSchema={RegisterSchema}
			onSubmit={async (values, actions) => {
				if (!usernames.includes(values.username)) {
					signUp(values.email, values.password)
						.then(async (userCredential) => {
							const user = userCredential.user;
							setDoc(doc(db, "usernames", values.username), {
								uid: user.uid,
								images: [],
							})
								.then(() => {
									updateProfileDetails(
										user,
										`${values.firstname} ${values.lastname}`
									);
									sendVerificationEmail(user).then(() => {
										if (redirect) {
											router.replace(redirect);
										} else {
											router.replace("/");
										}
									});
									actions.setSubmitting(false);
								})
								.catch((error) => {
									actions.setSubmitting(false);
									console.error(error.message);
								});
						})
						.catch((error) => {
							actions.setSubmitting(false);
							console.error(error.message);
						});
				} else {
					console.error("Username already taken");
				}
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
						name="username"
						label="Username"
						placeholder="Username"
						type="text"
						autoComplete="username"
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
