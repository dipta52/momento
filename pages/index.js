import SearchForm from "@components/SearchForm";
import Navbar from "@components/shared/Navbar";
import { Box } from "@mui/material";
import React from "react";

const HomePage = () => {
  return (
    <>
      <Navbar />

      <Box sx={{ display: "grid", placeItems: "center", height: "90vh" }}>
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
