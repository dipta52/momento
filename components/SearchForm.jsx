import { Autocomplete, Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { collection, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { db } from "../firebase";
import FullPageLoadingSpinner from "./shared/FullPageLoadingSpinner";

const SearchForm = () => {
  const [searchKey, setSearchKey] = useState();
  const [usernames, setUsernames] = useState();
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(
    () =>
      onSnapshot(collection(db, "usernames"), (snapshot) => {
        setUsernames(snapshot.docs.map((doc) => doc.id));
        setLoading(false);
      }),
    []
  );

  if (loading) {
    return <FullPageLoadingSpinner />;
  }

  console.log(searchKey);

  return (
    <>
      <Autocomplete
        freeSolo
        id="free-solo-2-demo"
        disableClearable
        onInputChange={(e, value) => setSearchKey(value)}
        options={usernames.map((option) => option)}
        renderInput={(params) => (
          <TextField
            {...params}
            value={searchKey}
            onChange={(e) => setSearchKey(e.currentTarget.value)}
            label="Search Username"
            InputProps={{
              ...params.InputProps,
              type: "search",
            }}
          />
        )}
      />
      <Box sx={{ textAlign: "center", my: 4 }}>
        <Button
          variant="outlined"
          startIcon={<AiOutlineSearch />}
          onClick={() => router.push(`/${searchKey}`)}
        >
          Search
        </Button>
      </Box>
    </>
  );
};

export default SearchForm;
