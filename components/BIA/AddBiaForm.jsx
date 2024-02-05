import { useState, useRef, useEffect } from "react";
import { Field, Form, Formik, ErrorMessage } from "formik";
import { biaClientValidation } from "@/validator/validator";
import provinces from "@/utils/provinces";

const AddBia = ({ addNewBia }) => {
  const alertDiv = useRef(); // Ref for the alert message container
  const formDivRef = useRef(); // Ref for the form container
  const bodyRef = useRef();

  const [serverError, setServerError] = useState(null);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const addressData = {
        postalCode: values.postalCode,
        province: values.province,
        city: values.city,
        street1: values.street1,
        street2: values.street2 || null,
      };

      await addNewBia({
        nameOfBia: values.nameOfBia,
        personOfContact: values.personOfContact,
        emailOfContact: values.emailOfContact,
        phBia: values.phBia,
        phPersonOfContact: values.phPersonOfContact,
        active: values.active,
        addresses: [addressData],
      });

      resetForm();
      setServerError(null);
    } catch (error) {
      // Handle errors from the API call
      setServerError("Failed to add BIA..!BIA with same name or email exist");
      alertDiv.current.scrollIntoView({ behavior: "smooth" });
      setShouldScrollToError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div ref={formDivRef}>
      <Formik
        initialValues={{
          nameOfBia: "",
          personOfContact: "",
          emailOfContact: "",
          postalCode: "",
          province: "",
          city: "",
          street1: "",
          street2: "",
          phBia: "",
          phPersonOfContact: "",
          active: true,
        }}
        validationSchema={biaClientValidation}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div ref={bodyRef}>
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
              <h2 className="text-2xl font-semibold mb-6">BIA Info</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="nameOfBia" className="block text-lg font-medium text-gray-700">
                    Name of BIA:
                  </label>

                  <Field
                    type="text"
                    id="nameOfBia"
                    name="nameOfBia"
                    className="block w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                  />

                  <ErrorMessage name="nameOfBia" component="div" className="text-red-600" />
                </div>

                <div>
                  <label htmlFor="phBia" className="block text-lg font-medium text-gray-700">
                    BIA Phone Number:
                  </label>

                  <Field
                    type="text"
                    id="phBia"
                    name="phBia"
                    className="block w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                  />

                  <ErrorMessage name="phBia" component="div" className="text-red-600" />
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
                  <label htmlFor="province" className="block text-lg font-medium text-gray-700">
                    Province:
                  </label>

                  <Field
                    as="select"
                    id="province"
                    name="province"
                    className="block w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Province</option>

                    {provinces
                      .filter((province) => province !== "All Provinces")
                      .map((province) => (
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

              <div className="mt-6">
                <h2 className="text-2xl font-semibold mb-6">Contact Info</h2>

                <div>
                  <label htmlFor="personOfContact" className="block text-lg font-medium text-gray-700">
                    Contact Person Name:
                  </label>

                  <Field
                    type="text"
                    id="personOfContact"
                    name="personOfContact"
                    className="block w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                  />

                  <ErrorMessage name="personOfContact" component="div" className="text-red-600" />
                </div>

                <div>
                  <label htmlFor="emailOfContact" className="block text-lg font-medium text-gray-700">
                    Email of Contact:
                  </label>

                  <Field
                    type="email"
                    id="emailOfContact"
                    name="emailOfContact"
                    className="block w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                  />

                  <ErrorMessage name="emailOfContact" component="div" className="text-red-600" />
                </div>

                <div>
                  <label htmlFor="phPersonOfContact" className="block text-lg font-medium text-gray-700">
                    Contact Person Phone Number:
                  </label>

                  <Field
                    type="text"
                    id="phPersonOfContact"
                    name="phPersonOfContact"
                    className="block w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                  />

                  <ErrorMessage name="phPersonOfContact" component="div" className="text-red-600" />
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

export default AddBia;
