import { useRouter } from "next/router";
import FullPageLoadingSpinner from "./shared/FullPageLoadingSpinner";
import { useAuth } from "@contexts/AuthContext";

export const withProtected = (Component) => {
  return function WithProtected(props) {
    const { currentUser, loading } = useAuth();
    const router = useRouter();

    if (loading) {
      return <FullPageLoadingSpinner />;
    }

    if (!currentUser) {
      router
        .replace(
          {
            pathname: "/auth/login",
            query: {
              redirect: router.pathname,
            },
          },
          undefined,
          {
            shallow: true,
          }
        )
        .then(() => console.error("Not Logged In."));
      return <FullPageLoadingSpinner />;
    }

    return <Component {...props} />;
  };
};

export const withVerified = (Component) => {
  return function WithVerified(props) {
    const { currentUser, loading } = useAuth();
    const router = useRouter();

    if (loading) {
      return <FullPageLoadingSpinner />;
    }

    if (!currentUser) {
      router
        .replace(
          {
            pathname: "/auth/login",
            query: {
              redirect: router.pathname,
            },
          },
          undefined,
          {
            shallow: true,
          }
        )
        .then(() => console.error("Not Logged In."));
      return <FullPageLoadingSpinner />;
    }

    if (!currentUser.emailVerified) {
      router
        .replace(
          {
            pathname: "/auth/not-verified",
            query: {
              redirect: router.pathname,
            },
          },
          undefined,
          {
            shallow: true,
          }
        )
        .then(() => console.error("User Not Verified."));
      return <FullPageLoadingSpinner />;
    }

    return <Component {...props} />;
  };
};

export const withAuthPages = (Component) => {
  return function WithAuthPages(props) {
    const { currentUser, loading } = useAuth();
    const router = useRouter();
    const { redirect } = router.query;

    if (loading) {
      return <FullPageLoadingSpinner />;
    }

    if (currentUser) {
      console.log("Already Logged In.");
      redirect ? router.replace(redirect) : router.back();
      return <FullPageLoadingSpinner />;
    }

    return <Component {...props} />;
  };
};
