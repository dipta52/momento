import GalleryEditForm from "@components/Gallery/GalleryEditPage";
import { withVerified } from "@components/routes";
import FullPageLoadingSpinner from "@components/shared/FullPageLoadingSpinner";
import { useAuth } from "@contexts/AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
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

const GalleryEditPage = () => {
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

	if (currentUser.uid !== state.uid) {
		return <p>You dont have permission to edit this</p>;
	}

	return (
		<div>
			<h1>{username}&apos;s Edit Page</h1>
			<GalleryEditForm images={state.images} username={username} />
		</div>
	);
};

export default withVerified(GalleryEditPage);
