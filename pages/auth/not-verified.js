import { withProtected } from "@components/routes";
import FullPageLoadingSpinner from "@components/shared/FullPageLoadingSpinner";
import { useAuth } from "@contexts/AuthContext";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import React from "react";

const NotVerifiedPage = () => {
  const router = useRouter();
  const { currentUser, sendVerificationEmail } = useAuth();

  if (currentUser.emailVerified) {
    router.replace("/");
    return <FullPageLoadingSpinner />;
  }

  return (
    <Box sx={{ display: "grid", placeItems: "center", height: "100vh" }}>
      <Stack spacing={4}>
        <Alert severity="warning">
          <AlertTitle>Email Not Verified !</AlertTitle>
          An email has been sent to you. — <strong>Verify you Email!</strong>
        </Alert>
        <Typography variant="p" component="p" textAlign="center">
          Verification Status :{" "}
          <Typography
            variant="span"
            component="span"
            color={currentUser.emailVerified ? "green" : "red"}
          >
            {currentUser.emailVerified ? `Verified` : `Not Verified`}
          </Typography>
        </Typography>

        <Stack direction="row" spacing={4}>
          <Button
            variant="outlined"
            onClick={() => sendVerificationEmail(currentUser)}
          >
            Send Verification Email
          </Button>

          <Button variant="outlined" onClick={() => router.reload()}>
            Already Verified?
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default withProtected(NotVerifiedPage);
