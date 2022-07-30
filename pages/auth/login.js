import LoginForm from "@components/Auth/LoginForm";
import { withAuthPages } from "@components/routes";
import React from "react";

const LoginPage = () => {
	return (
		<div>
			<h1>Login Page</h1>
			<LoginForm />
		</div>
	);
};

export default withAuthPages(LoginPage);
