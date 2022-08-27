import LoginForm from "@components/Auth/LoginForm";
import { withAuthPages } from "@components/routes";
import { Box, Stack, Link as MLink, Typography } from "@mui/material";
import React from "react";
import Link from "next/link";

const LoginPage = () => {
	return (
		<Stack direction="row" w="full">
			<Box
				sx={{
					display: ["none", "none", "none", "flex", "flex"],
					width: ["null", "null", "null", "100%", "100%"],
					backgroundImage:
						"url(https://images.unsplash.com/photo-1552083375-1447ce886485?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80)",
					backgroundSize: "cover",
				}}
			></Box>
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
							Login Page
						</Typography>
						<Typography
							variant="h5"
							component="h5"
							fontSize={"20px"}
							fontWeight={200}
						>
							Your gateway to gallery.
						</Typography>
					</Box>
				</Box>
				<LoginForm />
				<Typography
					variant="h5"
					component="h5"
					fontSize={"16px"}
					fontWeight={400}
				>
					Dont have a account,{" "}
					<Link href="/auth/register	">
						<MLink underline="hover" sx={{ cursor: "pointer" }}>
							Register ?
						</MLink>
					</Link>
				</Typography>
			</Box>
		</Stack>
	);
};

export default withAuthPages(LoginPage);
