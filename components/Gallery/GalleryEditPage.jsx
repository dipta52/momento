import InputField from "@components/ui/InputField";
import { doc, updateDoc } from "firebase/firestore";
import { FieldArray, Form, Formik } from "formik";
import Image from "next/image";
import { db } from "../../firebase";

const GalleryEditForm = ({ images, username }) => {
	return (
		<Formik
			initialValues={{
				images: images,
			}}
			onSubmit={async (values, actions) => {
				await updateDoc(doc(db, "usernames", username), values);
				actions.setSubmitting(false);
			}}
		>
			{({ values, isSubmitting }) => (
				<Form>
					<FieldArray name="images">
						{({ remove, push }) => (
							<div>
								{values.images.length > 0 &&
									values.images.map((image, index) => (
										<div key={index}>
											<Image
												src={values.images[index].imageUrl}
												height="200"
												width="200"
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
											<button type="button" onClick={() => remove(index)}>
												X
											</button>
										</div>
									))}
								<button
									type="button"
									className="secondary"
									onClick={() => push({ imageUrl: "", imageRef: "" })}
								>
									Add Image
								</button>
							</div>
						)}
					</FieldArray>
					<button type="submit">
						{isSubmitting ? "Loading..." : "Update"}
					</button>
				</Form>
			)}
		</Formik>
	);
};

export default GalleryEditForm;
