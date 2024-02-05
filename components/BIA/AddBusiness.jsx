import React, { useState, useRef, useEffect } from "react";
import { Field, Form, Formik, ErrorMessage } from "formik";
import { useRouter } from "next/router";
import { CATEGORY } from "@/utils/Category";
// import "tailwindcss/tailwind.css";
import { businessClientValidation } from "@/validator/validator";
import { useSession, signOut } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";

const AddBusiness = ({ id, onClose }) => {
  const { data: session } = useSession();

  const alertDiv = useRef(); // Ref for the alert message container
  const formDivRef = useRef(); // Ref for the form container
  const router = useRouter(); // router object
  const [shouldScrollToError, setShouldScrollToError] = useState(false);

  const fetchBiaDetails = async () => {
    try {
      const biaDetailsResponse = await fetch(`/api/bias/${id}`);
      if (!biaDetailsResponse.ok) {
        throw new Error("Failed to fetch BIA details");
      }

      const biaDetails = await biaDetailsResponse.json();
      console.log("BIA Details:", biaDetails);

      return {
        city: biaDetails.addresses[0]?.city,
        province: biaDetails.addresses[0]?.province,
      };
    } catch (error) {
      console.error("Error fetching BIA details:", error);
      // Handle the error gracefully, return default or empty values
      return { city: "", province: "" };
    }
  };

  const handleSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
    try {
      const { email: userEmail } = session.user; // Destructure the email from the user object

      // Fetch BIA details
      const { city, province } = await fetchBiaDetails();

      // Continue with the form submission
      const response = await fetch("/api/business/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          userEmail,
          Category: values.category,
          city,
          province,
          id,
        }),
      });

      if (response.ok) {
        if (session.user.role === "SUPER_ADMIN") {
          router.push({
            pathname: `/bias/${id}`,
            query: { success: "Business added successfully!" },
          });
        } else if (session.user.role === "BIA") {
          router.push({
            pathname: "/business/",
            query: { success: "Business added successfully!" },
          });
        }
        onClose();
        resetForm();
        toast.success("Business added successfully!");

        console.log("Business added successfully!");
      } else {
        const data = await response.json();
        setServerError(data.error);
        setShouldScrollToError(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setServerError("An error occurred while submitting the form.");
      setShouldScrollToError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    // Scroll to the top of the page when the alert is displayed
    if (serverError) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      setShouldScrollToError(false);
    }
  }, [serverError]);

  return (
    <div ref={formDivRef}>
      <div>
        <Toaster />
      </div>
      <div>
        <Formik
          initialValues={{
            name: "",
            email: "",
            Phone: "",
            street1: "",
            street2: "",
            postalCode: "",
            // Add more fields for your business data
          }}
          validationSchema={businessClientValidation}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div ref={alertDiv}>
                {serverError && (
                  <div className="alert alert-error">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{serverError}</span>
                  </div>
                )}
              </div>

              <h2 className="text-2xl font-semibold mb-6">Business Info</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-lg font-medium text-gray-700">
                    Name of Business:
                  </label>

                  <Field
                    type="text"
                    id="name"
                    name="name"
                    className="block w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                  />

                  <ErrorMessage name="name" component="div" className="text-red-600" />
                </div>

                <div>
                  <label htmlFor="email" className="block text-lg font-medium text-gray-700">
                    Email of Business:
                  </label>

                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className="block w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                  />

                  <ErrorMessage name="email" component="div" className="text-red-600" />
                </div>

                <div>
                  <label htmlFor="Phone" className="block text-lg font-medium text-gray-700">
                    Phone Number:
                  </label>

                  <Field
                    type="Phone"
                    id="Phone"
                    name="Phone"
                    className="block w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                  />

                  <ErrorMessage name="Phone" component="div" className="text-red-600" />
                </div>

                <div>
                  <label htmlFor="street1" className="block text-lg font-medium text-gray-700">
                    Street 1:
                  </label>

                  <Field
                    type="text"
                    id="street1"
                    name="street1"
                    className="block w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                  />

                  <ErrorMessage name="street1" component="div" className="text-red-600" />
                </div>

                <div>
                  <label htmlFor="street2" className="block text-lg font-medium text-gray-700">
                    Street 2 (Optional):
                  </label>

                  <Field
                    type="text"
                    id="street2"
                    name="street2"
                    className="block w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                  />

                  <ErrorMessage name="street2" component="div" className="text-red-600" />
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-lg font-medium text-gray-700">
                    Postal Code:
                  </label>

                  <Field
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    className="block w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                  />

                  <ErrorMessage name="postalCode" component="div" className="text-red-600" />
                </div>
                <div>
                  <label htmlFor="category" className="block text-lg font-medium text-gray-700">
                    Category:
                  </label>

                  <Field
                    as="select"
                    id="category"
                    name="category"
                    className="block w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    {Object.keys(CATEGORY).map((key) => (
                      <option key={key} value={key}>
                        {CATEGORY[key]}
                      </option>
                    ))}
                  </Field>

                  <ErrorMessage name="category" component="div" className="text-red-600" />
                </div>

                {/* Add more fields for your business data */}
              </div>

              <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full mt-6">
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddBusiness;
