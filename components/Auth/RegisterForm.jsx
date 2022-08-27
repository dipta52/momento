import FullPageLoadingSpinner from "@components/shared/FullPageLoadingSpinner";
import InputField from "@components/ui/InputField";
import { useAuth } from "@contexts/AuthContext";
import { collection, doc, onSnapshot, query, setDoc } from "firebase/firestore";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { db } from "../../firebase";
import { useSnackbar } from "notistack";
import { Button, Stack, Box } from "@mui/material";

const RegisterForm = () => {
  const router = useRouter();
  const { redirect } = router.query;
  const { signUp, updateProfileDetails, sendVerificationEmail, currentUser } =
    useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [usernames, setUsernames] = useState([]);

  const RegisterSchema = Yup.object().shape({
    firstname: Yup.string().required("Required"),
    lastname: Yup.string().required("Required"),
    email: Yup.string().email("Invalid Email").required("Required"),
    password: Yup.string()
      .min(6, "Too Short")
      .max(30, "Too Long")
      .required("Required"),
    username: Yup.string()
      .min(3, "Too Short")
      .max(30, "Too Long")
      .required("Required")
      .notOneOf(usernames, "Already Taken"),
  });

  useEffect(
    () =>
      onSnapshot(query(collection(db, "usernames")), (snapshot) => {
        setUsernames(snapshot.docs.map((doc) => doc.id));
      }),
    []
  );

  if (currentUser) {
    router.replace(redirect || "/");
    return <FullPageLoadingSpinner />;
  }

  return (
    <Formik
      initialValues={{
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        password: "",
      }}
      validationSchema={RegisterSchema}
      onSubmit={async (values, actions) => {
        if (!usernames.includes(values.username)) {
          signUp(values.email, values.password)
            .then(async (userCredential) => {
              const user = userCredential.user;
              setDoc(doc(db, "usernames", values.username), {
                uid: user.uid,
                images: [],
              })
                .then(() => {
                  updateProfileDetails(
                    user,
                    `${values.firstname} ${values.lastname}`
                  );
                  sendVerificationEmail(user).then(() => {
                    if (redirect) {
                      router.replace(redirect);
                    } else {
                      router.replace("/");
                    }
                  });
                  enqueueSnackbar("Logged In Successfully", {
                    variant: "success",
                  });
                  actions.setSubmitting(false);
                })
                .catch((error) => {
                  actions.setSubmitting(false);
                  console.error(error.message);
                });
            })
            .catch((error) => {
              enqueueSnackbar(error.message, {
                variant: "error",
              });
              actions.setSubmitting(false);
              console.error(error.message);
            });
        } else {
          console.error("Username already taken");
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Stack
            spacing={2}
            sx={{
              marginX: "8px",
            }}
          >
            <Box>
              <Stack direction="row" gap={2}>
                <InputField
                  name="firstname"
                  label="First Name"
                  placeholder="First Name"
                  type="text"
                  autoComplete="firstname"
                />
                <InputField
                  name="lastname"
                  label="Last Name"
                  placeholder="Last Name"
                  type="text"
                  autoComplete="lastname"
                />
              </Stack>
              <InputField
                name="email"
                label="Email"
                placeholder="Email"
                type="email"
                autoComplete="email"
              />
              <Stack direction="row" gap={2}>
                <InputField
                  name="username"
                  label="Username"
                  placeholder="Username"
                  type="text"
                  autoComplete="username"
                />

                <InputField
                  name="password"
                  label="Password"
                  placeholder="Password"
                  type="password"
                  autoComplete="current-password"
                />
              </Stack>
            </Box>

            <Button variant="contained" type="submit">
              {isSubmitting ? "Loading" : "Register"}
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterForm;
