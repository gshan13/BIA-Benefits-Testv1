import { useState, useRef, useEffect } from "react";
import { Field, Form, Formik, ErrorMessage } from "formik";
import { useRouter } from "next/router";
import { employeesClientValidation } from "@/validator/validator";
import { useSession } from "next-auth/react";

const AddEmployees = ({ id, onClose, handleSubmit }) => {
  const alertDiv = useRef(); // Ref for the alert message container
  const formDivRef = useRef(); // Ref for the form container

  if (id) {
    const fetchData = async () => {
      try {
        const businessResponse = await fetch(`/api/business/${id}`);
        if (businessResponse.ok) {
          const businessData = await businessResponse.json();
          console.log("business data", businessData);

          const biaResponse = await fetch(`/api/bias/${businessData.biaId}`);
          if (biaResponse.ok) {
            const biaData = await biaResponse.json();
            setBiaName(biaData.nameOfBia);
            setBusiness(businessData);
            setBiaId(biaData.id);
            console.log("BIA Name:", biaData.nameOfBia);
            console.log("bia data", biaData);
          } else {
            throw new Error("Failed to fetch BIA data");
          }
        } else {
          console.error("Failed to fetch Business data:", businessResponse);
          throw new Error("Failed to fetch Business data");
        }
      } catch (error) {
        // Handle the error as needed
        console.error(error);
      }
    };

    fetchData();
  }

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
        <Formik
          initialValues={{
            first_name: "",
            last_name: "",
            email: "",
            Phone: "",

            // Add more fields for your business data
          }}
          validationSchema={employeesClientValidation}
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

              <h2 className="text-2xl font-semibold mb-6">Employee Info</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="first_name" className="block text-lg font-medium text-gray-700">
                    First Name :
                  </label>

                  <Field
                    type="text"
                    id="first_name"
                    name="first_name"
                    className="block w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                  />

                  <ErrorMessage name="first_name" component="div" className="text-red-600" />
                </div>

                <div>
                  <label htmlFor="first_name" className="block text-lg font-medium text-gray-700">
                    Last Name :
                  </label>

                  <Field
                    type="text"
                    id="last_name"
                    name="last_name"
                    className="block w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                  />

                  <ErrorMessage name="last_name" component="div" className="text-red-600" />
                </div>

                <div>
                  <label htmlFor="email" className="block text-lg font-medium text-gray-700">
                    Email:
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

export default AddEmployees;
