import "nprogress/nprogress.css";
import "../styles/globals.css";

import { AuthProvider } from "@contexts/AuthContext";
import { CacheProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import Head from "next/head";
import Router from "next/router";
import NProgress from "nprogress";
import createEmotionCache from "@lib/createEmotionCache";
import theme from "@config/theme";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const clientSideEmotionCache = createEmotionCache();

function MyApp(props) {
	const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

	return (
		<CacheProvider value={emotionCache}>
			<Head>
				<meta name="viewport" content="initial-scale=1, width=device-width" />
			</Head>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<AuthProvider>
					<Component {...pageProps} />;
				</AuthProvider>
			</ThemeProvider>
		</CacheProvider>
	);
}

export default MyApp;
