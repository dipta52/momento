import { useWidth } from "@hooks/useWidth";
import {
  Box,
  Button,
  IconButton,
  ImageList,
  ImageListItem,
  LinearProgress,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { FieldArray, Form, Formik } from "formik";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { AiOutlineZoomIn, AiOutlineZoomOut } from "react-icons/ai";
import { CiImageOn } from "react-icons/ci";
import { IoMdCloseCircle } from "react-icons/io";
import { db, storage } from "../../firebase";

const GalleryEditForm = ({ images, username }) => {
  const width = useWidth();
  const [fileUploadProgress, setFileUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState();
  const [deletedImages, setDeletedImages] = useState([]);
  const [preview, setPreview] = useState();

  const [zoom, setZoom] = useState(width === "xs" ? 2 : width === "sm" ? 3 : 5);

  const onDrop = useCallback((acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  return (
    <Formik
      initialValues={{
        images: images,
      }}
      onSubmit={async (values, actions) => {
        deletedImages.forEach(async (image) => {
          deleteObject(ref(storage, image))
            .then(() => {
              console.log("deleted");
            })
            .catch((error) => console.log(error));
        });
        await updateDoc(doc(db, "usernames", username), values);
        actions.setSubmitting(false);
      }}
    >
      {({ values, isSubmitting, dirty }) => (
        <Form>
          <FieldArray name="images">
            {({ insert, remove }) => (
              <div>
                <div>
                  {selectedFile ? (
                    <Stack
                      direction="row"
                      spacing={2}
                      justifyContent={"center"}
                      alignItems={"center"}
                      flexWrap={"wrap"}
                      m={4}
                    >
                      <img src={preview} alt="Preview" height="200" />
                      <Box sx={{ flexGrow: 1, padding: "2rem" }}>
                        <Box sx={{ margin: "2rem", marginTop: 0 }}>
                          <LinearProgress
                            variant="determinate"
                            sx={{ height: "16px" }}
                            value={fileUploadProgress}
                          />
                          <p>{fileUploadProgress}%</p>
                        </Box>
                        <Stack
                          direction="row"
                          spacing={2}
                          justifyContent={"center"}
                          alignItems={"center"}
                          m={4}
                        >
                          <Button
                            color="success"
                            onClick={async () => {
                              const imageRef = `images/${username}/image${nanoid()}`;
                              const uploadTask = uploadBytesResumable(
                                ref(storage, imageRef),
                                selectedFile
                              );

                              uploadTask.on(
                                "state_changed",
                                (snapshot) => {
                                  setFileUploadProgress(
                                    Math.round(
                                      (snapshot.bytesTransferred /
                                        snapshot.totalBytes) *
                                        100
                                    )
                                  );
                                },
                                (error) => console.log(error),
                                async () => {
                                  await getDownloadURL(
                                    ref(storage, imageRef)
                                  ).then((downloadURL) => {
                                    insert(values.images.length, {
                                      imageUrl: downloadURL,
                                      imageRef: imageRef,
                                    });
                                    setFileUploadProgress(0);
                                    setSelectedFile(undefined);
                                  });
                                }
                              );
                            }}
                          >
                            Upload Image
                          </Button>
                          <Button
                            color="error"
                            onClick={() => setSelectedFile(undefined)}
                          >
                            Discard
                          </Button>
                        </Stack>
                      </Box>
                    </Stack>
                  ) : (
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      {isDragActive ? (
                        <Box
                          sx={{
                            border: "2px dashed #121212",
                            display: "grid",
                            placeItems: "center",
                            height: "150px",
                            margin: "2rem",
                            padding: "2rem",
                          }}
                        >
                          <p>Drop the files here ...</p>
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            border: "2px dashed #121212",
                            display: "grid",
                            placeItems: "center",
                            height: "150px",
                            margin: "2rem",
                            padding: "2rem",
                          }}
                        >
                          <>
                            <CiImageOn transform="scale(2.5)" />
                            <p>
                              <Typography component="span" color="text.primary">
                                Upload a file{" "}
                              </Typography>
                              or drag and drop
                            </p>
                          </>
                        </Box>
                      )}
                    </div>
                  )}
                </div>
                <Stack
                  direction="row"
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  <Typography variant="h2" component="h2">
                    Images
                  </Typography>

                  <Box>
                    <Button type="submit" size="large" disabled={!dirty}>
                      {isSubmitting ? "Updaing  ..." : "Update Gallery"}
                    </Button>
                  </Box>
                  <Box textAlign={"right"} m={4}>
                    <Tooltip title="Zoom In">
                      <IconButton onClick={() => setZoom((zoom) => zoom - 1)}>
                        <AiOutlineZoomIn />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Zoom Out">
                      <IconButton onClick={() => setZoom((zoom) => zoom + 1)}>
                        <AiOutlineZoomOut />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Stack>
                <ImageList
                  sx={{ width: "100%" }}
                  variant="masonry"
                  cols={zoom}
                  gap={16}
                >
                  {values.images.length > 0 &&
                    values.images.map((item, index) => (
                      <ImageListItem key={item.imageUrl}>
                        <img
                          src={`${values.images[index].imageUrl}?w=161&fit=crop&auto=format`}
                          srcSet={`${values.images[index].imageUrl}?w=161&fit=crop&auto=format&dpr=2 2x`}
                          alt={item.title}
                          loading="lazy"
                          layout="fill"
                        />
                        <Tooltip title="Delete">
                          <IconButton
                            size="large"
                            type="Button"
                            sx={{
                              position: "absolute",
                              bottom: "0",
                              right: "0",
                            }}
                          >
                            <IoMdCloseCircle size="40px" color="transparent" />
                          </IconButton>
                        </Tooltip>
                        <Button
                          variant="outlined"
                          color="error"
                          sx={{ width: "100%", marginY: 1 }}
                          onClick={() => {
                            setDeletedImages((deletedImages) => [
                              ...deletedImages,
                              values.images[index].imageUrl,
                            ]);
                            remove(index);
                          }}
                        >
                          Delete
                        </Button>
                      </ImageListItem>
                    ))}
                </ImageList>
              </div>
            )}
          </FieldArray>
        </Form>
      )}
    </Formik>
  );
};

export default GalleryEditForm;
