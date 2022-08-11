import LoginForm from "@components/Auth/LoginForm";
import { withAuthPages } from "@components/routes";
import { Box, Stack } from "@mui/material";
import React from "react";

const LoginPage = () => {
	return (
		<Stack direction="row" w="full">
			<Box
				sx={{
					display: ["none", "none", "none", "flex", "flex"],
					width: ["null", "null", "null", "66%", "66%"],
				}}
			>
				<h1>Login Page</h1>
			</Box>
			<Box sx={{ display: "grid", placeItems: "center", height: "100vh" }}>
				<LoginForm />
			</Box>
		</Stack>
	);
};

export default withAuthPages(LoginPage);
