import "../styles/globals.css";
import "nprogress/nprogress.css";

import Router from "next/router";
import NProgress from "nprogress";
import { AuthProvider } from "@contexts/AuthContext";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }) {
	return (
		<AuthProvider>
			<Component {...pageProps} />;
		</AuthProvider>
	);
}

export default MyApp;
