import { withVerified } from "@components/routes";
import FullPageLoadingSpinner from "@components/shared/FullPageLoadingSpinner";
import InputField from "@components/ui/InputField";
import { useAuth } from "@contexts/AuthContext";
import { Box, Button, Typography } from "@mui/material";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { db } from "../../firebase";

const CreateUser = () => {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [usernames, setUsernames] = useState([]);
  const [checked, setChecked] = useState(false);

  const CreateUserSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "Too Short")
      .max(30, "Too Long")
      .required("Required")
      .notOneOf(usernames, "Already Taken"),
  });

  useEffect(() => {
    const check = async () => {
      const querySnapshot = await getDocs(
        query(collection(db, "usernames"), where("uid", "==", currentUser.uid))
      );
      if (!querySnapshot.empty) {
        router.replace("/");
      }
    };
    check().then(() => {
      setChecked(true);
    });
  }, []);

  useEffect(
    () =>
      onSnapshot(query(collection(db, "usernames")), (snapshot) => {
        setUsernames(snapshot.docs.map((doc) => doc.id));
      }),
    []
  );

  if (!checked) {
    return <FullPageLoadingSpinner />;
  }

  return (
    <Formik
      initialValues={{ username: "" }}
      validationSchema={CreateUserSchema}
      onSubmit={(values, actions) => {
        if (!usernames.includes(values.username)) {
          setDoc(doc(db, "usernames", values.username), {
            uid: currentUser.uid,
            images: [],
          }).then(() => {
            router.replace("/");
          });
        } else {
          console.error("Username already taken");
        }
        actions.setSubmitting(false);
      }}
    >
      {({ isSubmitting, values }) => (
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
                Choose a Username
              </Typography>
              <Typography component="h1" variant="h1" fontSize="16px">
                We`ll use{" "}
                {values.username ? <strong>{values.username}</strong> : `this`}{" "}
                to identify you on the site
              </Typography>
            </Box>
            <Box>
              <InputField
                name="username"
                label="Username"
                placeholder="Username"
                type="text"
                autoComplete="username"
              />

              <Button type="submit" fullWidth>
                {isSubmitting ? "Loading" : "Continue"}
              </Button>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default withVerified(CreateUser);
