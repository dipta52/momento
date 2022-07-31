import { getFromStorage, setToStorage } from "@components/helpers/localstorage";
import {
	createUserWithEmailAndPassword,
	GoogleAuthProvider,
	linkWithPopup,
	onAuthStateChanged,
	sendEmailVerification,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut,
	unlink,
	updateProfile,
} from "firebase/auth";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { isEqual } from "lodash";
import React, { useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";

const AuthContext = React.createContext();

const useAuth = () => {
	return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
	const [loading, setLoading] = useState(true);
	const [currentUser, setCurrentUser] = useState();
	const [providers, setProviders] = useState();
	const googleAuthProvider = new GoogleAuthProvider();

	const signUp = async (email, password) => {
		return createUserWithEmailAndPassword(auth, email, password);
	};

	const logIn = (email, password) => {
		return signInWithEmailAndPassword(auth, email, password);
	};

	const sendVerificationEmail = async () => {
		return sendEmailVerification(currentUser);
	};

	const signInWithGoogle = async () => {
		return signInWithPopup(auth, googleAuthProvider);
	};

	const linkGoogleAccount = () => {
		return linkWithPopup(currentUser, googleAuthProvider);
	};

	const unLinkGoogleAccount = () => {
		return unlink(currentUser, "google.com");
	};

	const logOut = () => {
		return signOut(auth);
	};

	const resetPassword = (email) => {
		return sendPasswordResetEmail(auth, email);
	};

	const updateProfileDetails = (
		user = currentUser,
		displayName = user.displayName,
		photoURL = ""
	) => {
		return updateProfile(user, { displayName, photoURL });
	};

	const unsubscribe = useEffect(() => {
		onAuthStateChanged(auth, async (user) => {
			setCurrentUser(user);
			setProviders(
				user ? user.providerData.map((provider) => provider.providerId) : []
			);

			if (user) {
				if (
					!isEqual(
						{
							displayName: user.displayName,
							email: user.email,
							emailVerified: user.emailVerified,
							phoneNumber: user.phoneNumber,
							photoURL: user.photoURL,
							providerData: user.providerData,
							uid: user.uid,
						},
						JSON.parse(getFromStorage("currentUserState"))
					)
				) {
					try {
						await updateDoc(doc(db, "users", user.uid), {
							displayName: user.displayName,
							email: user.email,
							emailVerified: user.emailVerified,
							phoneNumber: user.phoneNumber,
							photoURL: user.photoURL,
							providerData: user.providerData,
							uid: user.uid,
						}).then(() => {
							setToStorage(
								"currentUserState",
								JSON.stringify({
									displayName: user.displayName,
									email: user.email,
									emailVerified: user.emailVerified,
									phoneNumber: user.phoneNumber,
									photoURL: user.photoURL,
									providerData: user.providerData,
									uid: user.uid,
								})
							);
						});
					} catch (error) {
						if (error.code === "not-found") {
							await setDoc(doc(db, "users", user.uid), {
								displayName: user.displayName,
								email: user.email,
								emailVerified: user.emailVerified,
								phoneNumber: user.phoneNumber,
								photoURL: user.photoURL,
								providerData: user.providerData,
								uid: user.uid,
							}).then(() => {
								setToStorage(
									"currentUserState",
									JSON.stringify({
										displayName: user.displayName,
										email: user.email,
										emailVerified: user.emailVerified,
										phoneNumber: user.phoneNumber,
										photoURL: user.photoURL,
										providerData: user.providerData,
										uid: user.uid,
									})
								);
							});
						}
					}
				}
			}
			setLoading(false);
		});

		return unsubscribe;
	}, []);

	const value = {
		currentUser,
		providers,
		signUp,
		logIn,
		logOut,
		resetPassword,
		updateProfileDetails,
		sendVerificationEmail,
		GoogleAuthProvider,
		signInWithGoogle,
		linkGoogleAccount,
		unLinkGoogleAccount,
	};

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	);
};

export { AuthProvider };
export { useAuth };
