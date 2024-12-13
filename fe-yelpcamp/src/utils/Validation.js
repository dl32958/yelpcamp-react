import * as Yup from "yup";

export const campgroundSchema = Yup.object().shape({
  title: Yup.string()
    .matches(/^[^\d]*$/, "Title must not contain numbers")
    .required("Title is required"),
  location: Yup.string()
    .required("Location is required"),
  image: Yup.string()
    .required("Image is required"),
  price: Yup.number()
    .typeError("Price must be a number")
    .required("Price is required")
    .positive("Price must be a positive number"),
  description: Yup.string()
    .required("Description is required"),
});