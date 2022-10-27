import "nprogress/nprogress.css";
import "../styles/globals.css";

import { AuthProvider } from "@contexts/AuthContext";
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "@lib/createEmotionCache";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Head from "next/head";
import Router from "next/router";
import { SnackbarProvider } from "notistack";
import NProgress from "nprogress";
import { createContext, useMemo, useState } from "react";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const clientSideEmotionCache = createEmotionCache();

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const [mode, setMode] = useState("light");
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                primary: {
                  main: "#319795",
                },
                secondary: {
                  main: "#90cdf4",
                },
                error: {
                  main: "#e57373",
                },
                type: "light",
                background: {
                  default: "#fafafa",
                  paper: "#edf2f7",
                },
                info: {
                  main: "#90cdf4",
                },
              }
            : {
                // palette values for dark mode
                primary: {
                  main: "#edf2f7",
                },
                secondary: {
                  main: "#81e6d9",
                },
                error: {
                  main: "#e57373",
                },
                type: "dark",
                background: {
                  default: "#1a202c",
                  paper: "#232934",
                },
                info: {
                  main: "#90cdf4",
                },
              }),
        },
      }),
    [mode]
  );

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            preventDuplicate
          >
            <AuthProvider>
              <Component {...pageProps} />
            </AuthProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </CacheProvider>
  );
}

export default MyApp;
