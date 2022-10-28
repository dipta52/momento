import GalleryEditForm from "@components/Gallery/GalleryEditPage";
import { withVerified } from "@components/routes";
import FullPageLoadingSpinner from "@components/shared/FullPageLoadingSpinner";
import Navbar from "@components/shared/Navbar";
import { useAuth } from "@contexts/AuthContext";
import { Avatar, Box, Button, Typography } from "@mui/material";
import { doc, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useReducer } from "react";
import { db } from "../firebase";

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

const ProfilePage = () => {
  const { currentUser, logOut, username } = useAuth();
  const router = useRouter();

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
    <>
      <Navbar />
      <Box
        sx={{
          display: "flex",
          justifyContent: { md: "space-between", sm: "center", xs: "center" },
          flexWrap: "wrap",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box sx={{ textAlign: "center", marginY: 4 }}>
          <Typography
            variant="h1"
            component="h1"
            fontSize={"56px"}
            fontWeight={300}
          >
            Profile
          </Typography>
        </Box>
        <Box>
          <Box sx={{ display: "flex", direction: "row", gap: 1 }}>
            <Avatar
              alt={currentUser.displayName}
              src={currentUser.photoURL}
              sx={{ width: 56, height: 56 }}
            />
            <Box sx={{ marginLeft: 2 }}>
              <Typography
                variant="h2"
                component="h2"
                fontSize={"24px"}
                fontWeight={300}
              >
                {currentUser.displayName}
              </Typography>{" "}
              <Typography
                variant="h2"
                component="h2"
                fontSize={"16px"}
                fontWeight={300}
              >
                {currentUser.email}
                {currentUser.emailVerified && `✅`}
              </Typography>
            </Box>
          </Box>
          <Typography
            variant="h3"
            component="h3"
            fontSize={"16px"}
            fontWeight={300}
            sx={{ marginTop: 2 }}
          >
            UID: <strong>{currentUser.uid}</strong>
          </Typography>
        </Box>
        {/* <p>{JSON.stringify(currentUser, null, 4)}</p> */}

        <Button
          color="error"
          variant="outlined"
          onClick={() => {
            logOut()
              .then(() => {
                router.replace("/auth/login");
              })
              .catch((error) => {
                console.error(error);
              });
          }}
        >
          Logout
        </Button>
      </Box>

      <GalleryEditForm images={state.images} username={username} />
    </>
  );
};

export default withVerified(ProfilePage);
