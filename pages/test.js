import getUserWithUsername from "@components/helpers/getUserWithUsername";
import { useAuth } from "@contexts/AuthContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebase";

const TestPage = () => {
	const { currentUser } = useAuth();
	const [state, setState] = useState();
	return (
		<>
			<p>{JSON.stringify(state, null, 2)}</p>
			<button
				onClick={async () => {
					const querySnapshot = await getDocs(
						query(
							collection(db, "usernames"),
							where("uid", "==", currentUser.uid)
						)
					);
					console.log(querySnapshot.empty);
					querySnapshot.forEach((doc) => {
						console.log(doc.id, " => ", doc.data());
					});
					setState(await getUserWithUsername("sahrohit9586@gmail.com"));
				}}
			>
				Fetch
			</button>
		</>
	);
};

export default TestPage;
