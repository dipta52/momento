import SearchForm from "@components/SearchForm";
import Navbar from "@components/shared/Navbar";
import { Box, Typography } from "@mui/material";
import React from "react";

const HomePage = () => {
  return (
    <>
      <Navbar />

      <Box
        sx={{
          display: "grid",
          placeItems: "center",
          alignContent: "center",
          marginTop: "10vh",
          marginX: { xs: 1, sm: 1 },
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", sm: "100%", md: "80%", lg: "60%" },
            my: 4,
          }}
        >
          <Typography
            variant="h1"
            component="h1"
            fontSize={"60px"}
            fontWeight={800}
            fontFamily="Helvetica"
          >
            Gallery
          </Typography>
          <Typography
            variant="h1"
            component="h1"
            fontSize={"20px"}
            fontWeight={400}
            letterSpacing={1}
          >
            The internet’s source for visuals. <br /> Powered by creators
            everywhere.
          </Typography>
        </Box>
        <Box
          sx={{
            width: { xs: "100%", sm: "100%", md: "80%", lg: "60%" },
          }}
        >
          <SearchForm />
        </Box>
      </Box>
    </>
  );
};

export default HomePage;
