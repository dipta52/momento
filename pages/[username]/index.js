import FullPageLoadingSpinner from "@components/shared/FullPageLoadingSpinner";
import { doc, onSnapshot } from "firebase/firestore";
import Image from "next/image";
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

	const [state, dispatch] = useReducer(reducer, {
		loading: true,
		userExistence: true,
		images: [],
	});

	useEffect(
		() =>
			onSnapshot(doc(db, "usernames", username), (doc) => {
				if (doc.exists()) {
					dispatch({
						type: "USER_FOUND",
						images: doc.data().images,
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

	return (
		<>
			{state.images.map((image, index) => (
				<Image key={index} src={image.imageUrl} height="200" width="300" />
			))}
		</>
	);
};

export default GalleryPage;
