import FullPageLoadingSpinner from "@components/shared/FullPageLoadingSpinner";
import { useAuth } from "@contexts/AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useReducer } from "react";
import { db } from "../../firebase";

const reducer = (state, action) => {
	switch (action.type) {
		case "USER_FOUND": {
			return {
				...state,
				loading: false,
				userExistence: true,
				images: action.images,
				uid: action.uid,
			};
		}
		case "USER_NOT_FOUND": {
			return {
				...state,
				loading: false,
				userExistence: false,
			};
		}
	}
};

const GalleryPage = () => {
	const router = useRouter();
	const { username } = router.query;
	const { currentUser } = useAuth();

	const [state, dispatch] = useReducer(reducer, {
		loading: true,
		userExistence: true,
		images: [],
		uid: "",
	});

	useEffect(
		() =>
			onSnapshot(doc(db, "usernames", username), (doc) => {
				if (doc.exists()) {
					dispatch({
						type: "USER_FOUND",
						images: doc.data().images,
						uid: doc.data().uid,
					});
				} else {
					dispatch({
						type: "USER_NOT_FOUND",
					});
				}
			}),
		[]
	);

	if (state.loading) {
		return <FullPageLoadingSpinner />;
	}

	if (!state.userExistence) {
		return <div>User does not exist</div>;
	}

	if (state.images.length === 0) {
		return <p>No Images Found</p>;
	}

	return (
		<>
			<h1>{username}&apos;s Page</h1>

			{state.uid === currentUser?.uid && (
				<Link href={`/${username}/edit`}>Edit?</Link>
			)}

			<br />

			{state.images.map((image, index) => (
				<Image key={index} src={image.imageUrl} height="200" width="300" />
			))}
		</>
	);
};

export default GalleryPage;
