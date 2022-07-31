import { withVerified } from "@components/routes";
import FullPageLoadingSpinner from "@components/shared/FullPageLoadingSpinner";
import InputField from "@components/ui/InputField";
import { useAuth } from "@contexts/AuthContext";
import {
	collection,
	doc,
	getDocs,
	onSnapshot,
	query,
	setDoc,
	where,
} from "firebase/firestore";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { db } from "../../firebase";

const CreateUser = () => {
	const router = useRouter();
	const { currentUser } = useAuth();
	const [usernames, setUsernames] = useState([]);
	const [checked, setChecked] = useState(false);

	const CreateUserSchema = Yup.object().shape({
		username: Yup.string()
			.min(3, "Too Short")
			.max(30, "Too Long")
			.required("Required")
			.notOneOf(usernames, "Already Taken"),
	});

	useEffect(() => {
		const check = async () => {
			const querySnapshot = await getDocs(
				query(collection(db, "usernames"), where("uid", "==", currentUser.uid))
			);
			if (!querySnapshot.empty) {
				router.replace("/");
			}
		};
		check().then(() => {
			setChecked(true);
		});
	}, []);

	useEffect(
		() =>
			onSnapshot(query(collection(db, "usernames")), (snapshot) => {
				setUsernames(snapshot.docs.map((doc) => doc.id));
			}),
		[]
	);

	if (!checked) {
		return <FullPageLoadingSpinner />;
	}

	return (
		<Formik
			initialValues={{ username: "" }}
			validationSchema={CreateUserSchema}
			onSubmit={(values, actions) => {
				if (!usernames.includes(values.username)) {
					setDoc(doc(db, "usernames", values.username), {
						uid: currentUser.uid,
						images: [],
					}).then(() => {
						router.replace("/");
					});
				} else {
					console.error("Username already taken");
				}
				actions.setSubmitting(false);
			}}
		>
			{({ isSubmitting }) => (
				<Form>
					<div>
						<InputField
							name="username"
							label="Username"
							placeholder="Username"
							type="text"
							autoComplete="username"
						/>

						<button type="submit">
							{isSubmitting ? "Loading" : "Continue"}
						</button>
					</div>
				</Form>
			)}
		</Formik>
	);
};

export default withVerified(CreateUser);
