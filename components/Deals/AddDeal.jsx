import React, { useState, useRef, useEffect } from "react";
import { Field, Form, Formik, ErrorMessage } from "formik";
import { dealClientValidation, dealServerValidation } from "@/validator/validator";
import { useRouter } from "next/router";
import provinces from "@/utils/provinces";

const AddDeals = ({ addDeals }) => {
  const alertDiv = useRef(); // Ref for the alert message container
  const formDivRef = useRef(); // Ref for the form container
  const router = useRouter(); // router object
  const [shouldScrollToError, setShouldScrollToError] = useState(false);
  const handleSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
    try {
      const addressData = {
        province: Array.isArray(values.province) ? values.province.join(", ") : values.province,
        city: values.city,
        street1: values.street1,
        street2: values.street2 || null,
      };

      // Call the addDeals function to handle the submission
      await addDeals(values);
      resetForm();
      // Redirect or perform other actions upon successful form submission
      router.push({
        pathname: "/deals",
        query: { success: "Deal added successfully!" },
      });
    } catch (error) {
      console.error("Error submitting the form:", error);

      // Handle errors or set serverError state
      setServerError(`Failed to add Deal: ${error.message || "Unknown error"}`);

      // Scroll to the alert message when there's an error
      alertDiv.current.scrollIntoView({ behavior: "smooth" });
      setShouldScrollToError(true);
    } finally {
      // Ensure that setSubmitting is called in all cases
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
      <Formik
        initialValues={{
          title: "",
          description: "",
          corporatePartner: "",
          province: "",
          city: "",
          street1: "",
          street2: "",
        }}
        validationSchema={dealClientValidation}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
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

              <h2 className="text-2xl font-semibold mb-6">Deal Info</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-lg font-medium text-gray-700">
                    Title:
                  </label>
                  <Field
                    type="text"
                    id="title"
                    name="title"
                    className="block w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <ErrorMessage name="title" component="div" className="text-red-600" />
                </div>

                <div>
                  <label htmlFor="corporatePartner" className="block text-lg font-medium text-gray-700">
                    Corporate Partner:
                  </label>
                  <Field
                    type="text"
                    id="corporatePartner"
                    name="corporatePartner"
                    className="block w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <ErrorMessage name="corporatePartner" component="div" className="text-red-600" />
                </div>

                <div>
                  <label htmlFor="description" className="block text-lg font-medium text-gray-700">
                    Description:
                  </label>
                  <Field
                    type="text"
                    id="description"
                    name="description"
                    className="block w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <ErrorMessage name="description" component="div" className="text-red-600" />
                </div>

                <div>
                  <label htmlFor="province" className="block text-lg font-medium text-gray-700">
                    Province:
                  </label>
                  <Field
                    as="select"
                    id="province"
                    name="province"
                    // multiple // This indicates that multiple selections are allowed
                    className="block w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select</option>
                    {provinces.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="province" component="div" className="text-red-600" />
                </div>

                <div>
                  <label htmlFor="city" className="block text-lg font-medium text-gray-700">
                    City:
                  </label>
                  <Field
                    type="text"
                    id="city"
                    name="city"
                    className="block w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <ErrorMessage name="city" component="div" className="text-red-600" />
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
              </div>
              <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full mt-6">
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddDeals;
