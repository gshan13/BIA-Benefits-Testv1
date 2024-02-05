import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import ProtectedPage from "@/components/ProtectedPage";
import { useSession } from "next-auth/react";
import Modal from "@/components/Common/Modal";
import AddEmployees from "@/components/Business/AddEmployees";
import toast, { Toaster } from "react-hot-toast";

function Business() {
  const router = useRouter();
  const { id } = router.query;
  const [business, setBusiness] = useState(null);
  const [biaName, setBiaName] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalId, setModalId] = useState();

  const openModal = (bia) => {
    setModalId(business.id);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmitBusinessDetails = async (values, { setSubmitting, setErrors, resetForm }) => {
    const userEmail = session?.user?.email;
    const businessID = router.query.businessId;
    console.log("business Id:", businessID);
    try {
      const response = await fetch("/api/employees/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          userEmail: userEmail,
          Category: values.category,
          businessId: id,
        }),
      });

      if (response.ok) {
        if (session.user.role === "SUPER_ADMIN") {
          router.push({
            pathname: `/business/${businessID}`,
            query: { success: "Business added successfully!" },
          });
        } else if (session.user.role === "BUSINESS") {
          router.push({
            pathname: "/employees/",
            query: { success: "Employee added successfully!" },
          });
        }
        resetForm();
        toast.success("Employee added successfully!");
        closeModal();
        console.log("Employee added successfully!");
      } else {
        // Handle errors from the API (e.g., show error message to the user)
        const data = await response.json();
        setServerError(data.error); // Assuming the API response structure includes an 'error' field
        setShouldScrollToError(true);
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error:", error);
      setServerError("An error occurred while submitting the form.");
      setShouldScrollToError(true);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/business/${id}`);
        if (response.ok) {
          const data = await response.json();
          setBusiness(data);

          // Fetch BIA name using biaId
          const id = data.biaId;
          const biaResponse = await fetch(`/api/bias/${id}`);
          if (biaResponse.ok) {
            const biaData = await biaResponse.json();
            setBiaName(biaData.nameOfBia);
          } else {
            throw new Error("Failed to fetch BIA data");
          }
        } else {
          throw new Error("Failed to fetch Business data");
        }
      } catch (error) {
        // Handle the error as needed
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  function formatUniqueId(uniqueId) {
    // Check if uniqueId is not null
    if (uniqueId !== null) {
      // Use toString() only if uniqueId is not null
      const formattedUniqueId = uniqueId
        .toString()
        .replace(/\s/g, "") // Remove any existing spaces
        .replace(/(\d{4})/g, "$1 "); // Add a space after every four digits
      return formattedUniqueId.trim(); // Remove leading/trailing spaces
    } else {
      // Handle the case where uniqueId is null (return an appropriate value)
      return "N/A"; // or any other default value or empty string
    }
  }

  return (
    <ProtectedPage allowedRoles={["SUPER_ADMIN", "BIA"]}>
      <div className="overflow-x-auto">
        <div className="text-sm breadcrumbs">
          <ul>
            <li>
              <Link className="font-bold" href={"/bias/"}>
                BIA's
              </Link>
            </li>
            <li>
              {biaName && (
                <Link className="font-bold" href={`/bias/${business.biaId}`}>
                  {biaName}
                </Link>
              )}
            </li>
            <li className="font-bold" key={business?.id}>
              {business?.name}
            </li>
          </ul>
        </div>

        {business ? (
          <div className="bg-white overflow-hidden shadow rounded-lg border mt-4 p-6">
            <div className="px-4 py-5 sm:px-6">
              <h1 className="text-3xl font-bold"> {business ? business.name : "Loading..."}</h1>
            </div>

            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Unique Id</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {formatUniqueId(business?.uniqueId)}
                  </dd>
                </div>

                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Business Category</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {business ? business.category : "Loading..."}
                  </dd>
                </div>

                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">City</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {business.bia.addresses[0]?.city || "N/A"}
                  </dd>
                </div>

                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Province</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {business.bia.addresses[0]?.province || "N/A"}
                  </dd>
                </div>

                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Postal Code</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {business.bia.addresses[0]?.postalCode || "N/A"}
                  </dd>
                </div>

                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">E-mail</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{business.users[0].email}</dd>
                </div>

                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Street 1</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {business.bia.addresses[0]?.street1 || "N/A"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        ) : (
          <p className="text-gray-700 text-xl font-semibold">Loading Business details...</p>
        )}

        <div className="bg-white overflow-hidden shadow rounded-lg border mt-4 p-6">
          <div className="flex justify-end mt-3">
            <span
              className="btn btn-primary"
              onClick={() => openModal(business)}
              href={{
                pathname: "/employees/new",
                query: { businessId: business?.id },
              }}
            >
              Add Employee
            </span>
          </div>
          {modalId && (
            <Modal modalId={modalId} isOpen={isModalOpen} onClose={closeModal} title="Add Employees">
              <AddEmployees id={modalId} onClose={closeModal} handleSubmit={handleSubmitBusinessDetails} />
            </Modal>
          )}

          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Employees</h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            {business && business.employees && business.employees.length > 0 ? (
              <div className="grid gap-2">
                <div className="w-full p-2 rounded-lg overflow-hidden bg-gray-200">
                  <div className="p-2 text-center">Employee Names</div>
                </div>
                {business.employees.map((employee) => (
                  <Link key={employee.id} href={`/employees/${employee.id}`}>
                    <div key={employee.id} className="cursor-pointer hover:bg-gray-100 p-2 text-center">
                      {employee.first_name}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p>No employees found for this business</p>
            )}
          </div>
        </div>
      </div>
    </ProtectedPage>
  );
}

export default Business;
