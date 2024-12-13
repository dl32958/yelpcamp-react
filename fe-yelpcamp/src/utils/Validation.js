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

export const reviewSchema = Yup.object().shape({
  rating: Yup.number()
    .typeError("Rating must be a number")
    .required("Rating is required")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  body: Yup.string()
    .required("Review is required"),
});