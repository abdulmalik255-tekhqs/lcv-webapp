import * as yup from "yup";

export const feedbackSchema = () =>
  yup.object({
    name: yup.string().required("Name is required"),
    email: yup.string().email().required("Email is required"),
    organization: yup.string().required("Company/Organization is required"),
    describeNeeds: yup.string().required("This field is required"),
    currentChallenges: yup.string().required("This field is required"),
  });

export const contactUsSchema = () =>
  yup.object({
    name: yup.string().required("Name is required"),
    email: yup.string().email().required("Email is required"),
    lookingfor: yup.string().required("Field is required"),
    message: yup.string().required("Field is required"),
  });
