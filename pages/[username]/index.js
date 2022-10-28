import FullPageLoadingSpinner from "@components/shared/FullPageLoadingSpinner";
import { useAuth } from "@contexts/AuthContext";
import {
  IconButton,
  ImageList,
  ImageListItem,
  Link as MLink,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { Box } from "@mui/system";
import { doc, onSnapshot } from "firebase/firestore";
import { useWidth } from "@hooks/useWidth";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useReducer } from "react";
import { db } from "../../firebase";
import { AiOutlineZoomIn, AiOutlineZoomOut } from "react-icons/ai";
import { useState } from "react";
import Navbar from "@components/shared/Navbar";

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
  const width = useWidth();
  const router = useRouter();
  const { username } = router.query;
  const { currentUser } = useAuth();

  const theme = useTheme();

  const [zoom, setZoom] = useState(width === "xs" ? 2 : width === "sm" ? 3 : 5);

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
      <Navbar />
      <Box textAlign={"center"} my={4}>
        <Typography
          variant="h1"
          component="h1"
          fontSize={"36px"}
          fontWeight={300}
        >
          {username}&apos;s profile
        </Typography>

        {state.uid === currentUser?.uid && (
          <Typography
            variant="h5"
            component="h5"
            fontSize={"16px"}
            fontWeight={400}
          >
            <Link href={`/${username}/edit`}>
              <MLink underline="hover" sx={{ cursor: "pointer" }}>
                Edit?
              </MLink>
            </Link>
          </Typography>
        )}
      </Box>
      <Stack
        direction="row"
        justifyContent={"space-between"}
        alignItems={"center"}
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Typography variant="h2" component="h2">
          Images
        </Typography>

        {/* <Box>
          <Button type="submit" size="large" disabled={!dirty}>
            {isSubmitting ? "Updaing  ..." : "Update Gallery"}
          </Button>
        </Box> */}
        <Box textAlign={"right"} m={3}>
          <Tooltip title="Zoom In">
            <IconButton onClick={() => setZoom((zoom) => zoom - 1)}>
              <AiOutlineZoomIn />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom Out">
            <IconButton onClick={() => setZoom((zoom) => zoom + 1)}>
              <AiOutlineZoomOut />
            </IconButton>
          </Tooltip>
        </Box>
      </Stack>
      <ImageList sx={{ width: "100%" }} variant="masonry" cols={zoom} gap={8}>
        {state.images.map((item) => (
          <ImageListItem key={item.imageUrl}>
            <img
              src={`${item.imageUrl}?w=161&fit=crop&auto=format`}
              srcSet={`${item.imageUrl}?w=161&fit=crop&auto=format&dpr=2 2x`}
              alt={item.title}
              loading="lazy"
              layout="fill"
            />
          </ImageListItem>
        ))}
      </ImageList>
    </>
  );
};

export default GalleryPage;
