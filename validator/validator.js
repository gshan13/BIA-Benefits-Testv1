import * as Yup from "yup";
import { PrismaClient } from "@prisma/client";

function isString(value) {
  return typeof value === "string";
}

export const biaClientValidation = Yup.object({
  province: Yup.string().required("Please enter the province"),
  city: Yup.string().required("Please enter the city"),
  street1: Yup.string().required("Please enter street1"),
  street2: Yup.string(),
  phBia: Yup.string().matches(
    /^\d{10}$/,
    "Invalid phone number. Please enter a 10-digit phone number."
  ),
  nameOfBia: Yup.string().required("please enter the name of the BIA"),
  personOfContact: Yup.string().required("Please enter the person of contact"),

  emailOfContact: Yup.string()
    .required("Please enter the email of contact")
    .email("Invalid email address"),
  postalCode: Yup.string()
    .required("Please enter the postal code")
    .test("is-valid-postal-code", "Invalid postal code format", (value) => {
      // Validate the length
      const isValidLength = value.replace(/\s/g, "").length === 6;
      // Remove spaces and validate the format
      const formattedPostalCode = value.replace(/\s/g, "").toUpperCase();
      const isValidFormat = /^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(formattedPostalCode);

      if (isValidLength && isValidFormat) {
        // Format the postal code with a space after the first 3 characters
        const firstPart = formattedPostalCode.substring(0, 3);
        const secondPart = formattedPostalCode.substring(3);
        const formattedCode = `${firstPart} ${secondPart}`;
        // Return the formatted code in lowercase for storage
        return formattedCode.toLowerCase();
      }
      return false;
    }),

  phPersonOfContact: Yup.string().matches(
    /^\d{10}$/,
    "Invalid phone number. Please enter a 10-digit phone number."
  ),
});

export const serverValidation = Yup.object().shape({
  phBia: Yup.string().test("is-string", "Value must be a string", isString),
  nameOfBia: Yup.string()
    .required("Please enter the name of the BIA")
    .test("is-string", "Value must be a string", isString),
  personOfContact: Yup.string()
    .required("Please enter the person of contact")
    .test("is-string", "Value must be a string", isString),
  emailOfContact: Yup.string()
    .required("Please enter the email of contact")
    .email("Invalid email address")
    .test("is-string", "Value must be a string", isString),
  phPersonOfContact: Yup.string().test(
    "is-string",
    "Value must be a string",
    isString
  ),
});

export const businessClientValidation = Yup.object({
  street1: Yup.string().required("Please enter street1"),
  street2: Yup.string(),
  Phone: Yup.string().matches(
    /^\d{10}$/,
    "Invalid phone number. Please enter a 10-digit phone number."
  ),
  name: Yup.string().required("Please enter the name of the BIA"),

  email: Yup.string()
    .required("Please enter the email of contact")
    .email("Invalid email address"),
  postalCode: Yup.string()
    .required("Please enter the postal code")
    .test("is-valid-postal-code", "Invalid postal code format", (value) => {
      // Validate the length
      const isValidLength = value.replace(/\s/g, "").length === 6;
      // Remove spaces and validate the format
      const formattedPostalCode = value.replace(/\s/g, "").toUpperCase();
      const isValidFormat = /^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(formattedPostalCode);

      if (isValidLength && isValidFormat) {
        // Format the postal code with a space after the first 3 characters
        const firstPart = formattedPostalCode.substring(0, 3);
        const secondPart = formattedPostalCode.substring(3);
        const formattedCode = `${firstPart} ${secondPart}`;
        // Return the formatted code in lowercase for storage
        return formattedCode.toLowerCase();
      }
      return false;
    }),
});

export const businessServerValidation = Yup.object({
  street1: Yup.string().required(),
  street2: Yup.string(),
  Phone: Yup.string(),
  name: Yup.string().required(),

  email: Yup.string().required().email(),
});

export const employeesClientValidation = Yup.object({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string(),
  phone: Yup.string(),
  email: Yup.string().email().required("Email is required"),
});

export const employeesServerSideValidation = Yup.object({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string(),
  phone: Yup.string(),
  email: Yup.string().email().required("Email is required"),
});

export const dealClientValidation = Yup.object({
  title: Yup.string().required("Title is required"),
  corporatePartner: Yup.string().required("Corporate Sponsor is required"),
  province: Yup.mixed().required("Province is required"),
  city: Yup.string().required("City is required"),
  street1: Yup.string().required("Street 1 is required"),
  street2: Yup.string(),
  description: Yup.string()
});
export const dealServerValidation = Yup.object({
  title: Yup.string().required,
  corporateSponsor: Yup.string().required(),
  province: Yup.string().required(),
  city: Yup.string().required(),
  street2: Yup.string(),
  description: Yup.string()
});
