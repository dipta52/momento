import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useAuth } from "@contexts/AuthContext";
import InputField from "@components/ui/InputField";
import Link from "next/link";
import { withAuthPages } from "@components/routes";
import { Box, Button, Typography, Link as MLink, Stack } from "@mui/material";

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid Email").required("Required"),
});

const ForgotPassword = () => {
  const { resetPassword } = useAuth();

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={ForgotPasswordSchema}
      onSubmit={(values, actions) => {
        resetPassword(values.email)
          .then(() => {
            console.log("Email Sent");
            actions.setSubmitting(false);
          })
          .catch((error) => {
            console.error(error);
            actions.setSubmitting(false);
          });
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Box
            sx={{
              display: "grid",
              placeItems: "center",
              alignContent: "center",
              height: "100vh",
            }}
          >
            <Box>
              <Typography
                component="h1"
                variant="h1"
                fontSize="24px"
                textAlign={"center"}
              >
                Reset Password
              </Typography>
              <Typography component="h1" variant="h1" fontSize="16px">
                We`ll mail you the link to reset your password
              </Typography>
            </Box>
            <Box>
              <InputField
                name="email"
                label="Email"
                placeholder="Email"
                type="text"
                autoComplete="username"
              />

              <Stack spacing={4} direction="row" alignItems={"center"}>
                <Typography
                  variant="h5"
                  component="h5"
                  fontSize={"16px"}
                  fontWeight={400}
                >
                  Dont need a reset,{" "}
                  <Link href="/auth/login	">
                    <MLink underline="hover" sx={{ cursor: "pointer" }}>
                      Login ?
                    </MLink>
                  </Link>
                </Typography>

                <Button type="submit" variant="outlined">
                  {isSubmitting ? "Loading" : "Send Reset Link"}
                </Button>
              </Stack>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default withAuthPages(ForgotPassword);
