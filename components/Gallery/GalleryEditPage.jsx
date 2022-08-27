import InputField from "@components/ui/InputField";
import { IconButton, ImageList, ImageListItem, Tooltip } from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import {
	deleteObject,
	getDownloadURL,
	ref,
	uploadBytesResumable,
} from "firebase/storage";
import { FieldArray, Form, Formik } from "formik";
import { nanoid } from "nanoid";
import { useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { db, storage } from "../../firebase";

const GalleryEditForm = ({ images, username }) => {
	const [fileUploadProgress, setFileUploadProgress] = useState(0);
	const [selectedFile, setSelectedFile] = useState();
	const [deletedImages, setDeletedImages] = useState([]);

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
								<ImageList
									sx={{ width: "100%" }}
									variant="masonry"
									cols={3}
									gap={8}
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
												<InputField
													name={`images.${index}.imageUrl`}
													placeholder="Image Url"
													label="Image Url"
													type="text"
													autoComplete="url"
												/>
												<InputField
													name={`images.${index}.imageRef`}
													placeholder="Image Ref"
													label="Image Ref"
													type="text"
													autoComplete="url"
												/>
												<Tooltip title="Delete">
													<IconButton
														size="large"
														type="button"
														sx={{
															position: "absolute",
															top: "0",
															right: "0",
														}}
														onClick={() => {
															setDeletedImages((deletedImages) => [
																...deletedImages,
																values.images[index].imageUrl,
															]);
															remove(index);
														}}
													>
														<IoMdCloseCircle size="40px" color="#e53e3e" />
													</IconButton>
												</Tooltip>
											</ImageListItem>
										))}
								</ImageList>
								<div>
									<input
										type="file"
										onChange={(e) => setSelectedFile(e.target.files[0])}
									/>
									<p>Progress : {fileUploadProgress}</p>

									<button
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
													await getDownloadURL(ref(storage, imageRef)).then(
														(downloadURL) => {
															insert(values.images.length, {
																imageUrl: downloadURL,
																imageRef: imageRef,
															});
															setFileUploadProgress(0);
															setSelectedFile(undefined);
														}
													);
												}
											);
										}}
									>
										Upload Image
									</button>
								</div>
							</div>
						)}
					</FieldArray>
					<button type="submit" disabled={!dirty}>
						{isSubmitting ? "Loading..." : "Update"}
					</button>
				</Form>
			)}
		</Formik>
	);
};

export default GalleryEditForm;
