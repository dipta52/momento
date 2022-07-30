import RegisterForm from "@components/Auth/RegisterForm";
import { withAuthPages } from "@components/routes";
import React from "react";

const RegisterPage = () => {
	return (
		<div>
			<h1>Login Page</h1>
			<RegisterForm />
		</div>
	);
};

export default withAuthPages(RegisterPage);
