import RegisterForm from "@components/Auth/RegisterForm";
import { Box, Stack, Link as MLink, Typography } from "@mui/material";
import React from "react";
import Link from "next/link";

const RegisterPage = () => {
  return (
    <Stack direction="row" w="full">
      <Box
        sx={{
          display: "grid",
          placeItems: "center",
          height: "100vh",
          alignContent: "space-evenly",
          width: ["100%", "100%", "100%", "50%", "50%"],
        }}
      >
        <Box sx={{ width: "80%" }}>
          <Link href="/">
            <MLink underline="hover" sx={{ cursor: "pointer" }}>
              Return Home,
            </MLink>
          </Link>
          <Box textAlign="center">
            <Typography
              variant="h1"
              component="h1"
              fontSize={"30px"}
              fontWeight={400}
            >
              Register Page
            </Typography>
            <Typography
              variant="h5"
              component="h5"
              fontSize={"20px"}
              fontWeight={200}
            >
              Get started within minutes.
            </Typography>
          </Box>
        </Box>
        <RegisterForm />
        <Typography
          variant="h5"
          component="h5"
          fontSize={"16px"}
          fontWeight={400}
        >
          Already have a account,{" "}
          <Link href="/auth/login">
            <MLink underline="hover" sx={{ cursor: "pointer" }}>
              Login ?
            </MLink>
          </Link>
        </Typography>
      </Box>
      <Box
        sx={{
          display: ["none", "none", "none", "flex", "flex"],
          width: ["null", "null", "null", "100%", "100%"],
          backgroundImage:
            "url(https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2073&q=80)",
          backgroundSize: "cover",
        }}
      ></Box>
    </Stack>
  );
};

export default RegisterPage;
