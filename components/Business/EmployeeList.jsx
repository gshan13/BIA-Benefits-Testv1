import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";
import PaginationLayout from "@/components/PaginationLayout";
import toast, { Toaster } from "react-hot-toast";
import AddEmployees from "./AddEmployees";
import Modal from "@/components/Common/Modal";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const router = useRouter();
  const { data: session } = useSession();
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25; // Define the number of items per page
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (bia) => {
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/employees/");
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data. Please try again later.");
      console.error(error);
      setError("Failed to fetch data. Please try again later.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddEmployeeClick = () => {
    openModal();
  };

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
  function capitalizeFirstLetter(str) {
    return str.replace(/(\b\w|\s\d)/g, (match) => match.toUpperCase());
  }

  const handleSubmitBusinessDetails = async (values, { setSubmitting, setErrors, resetForm }) => {
    console.log("Button Clicked");
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

  // Calculate the range of items to display based on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = employees.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () => {
    if (currentPage < Math.ceil(employees.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const itemsStart = (currentPage - 1) * itemsPerPage + 1;
  const itemsEnd = Math.min(currentPage * itemsPerPage, employees.length);

  return (
    <div className="overflow-x-auto">
      {success && <div className="alert alert-success mb-4">{success}</div>}
      {error && (
        <div className="alert alert-error mb-4">
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
          <span>{error}</span>
        </div>
      )}

      <div className="employee-container">
        <div className="flex justify-between items-center">
          <h1 className="table-title">
            Showing items {itemsStart} to {itemsEnd} out of {employees.length}
          </h1>
          <div className="flex ml-auto space-x-2">
            <button className="btn btn-active btn-primary ml-3 mb-3" onClick={handleAddEmployeeClick}>
              <FontAwesomeIcon icon={faPlus} />
              Add Employee
            </button>
          </div>
        </div>
        <div className="table-container">
          <div className="overflow-x-hidden">
            <Modal isOpen={isModalOpen} onClose={closeModal} title="Add Business">
              <AddEmployees onClose={closeModal} handleSubmit={handleSubmitBusinessDetails} />
            </Modal>
            <table className="w-full  p-2 rounded-lg " style={{ tableLayout: "fixed" }}>
              <thead className="bg-gray-200">
                <tr className="table-header">
                  <th className="p-2 w-1/5 text-left pl-5">First Name</th>
                  <th className="p-2 w-1/5 text-left pl-5">Last Name</th>
                  <th className="p-2 w-1/5 text-left pl-5">Email</th>
                  <th className="p-2 w-1/5 text-left pl-5">Unique Id</th>
                  <th className="p-2 w-1/5 text-left pl-5">Phone Number</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-100 cursor-default">
                    <td className="p-4 text-left w-1/5 cursor-pointer">{capitalizeFirstLetter(employee.first_name)}</td>
                    <td className="p-4 text-left w-1/5">{capitalizeFirstLetter(employee.last_name)}</td>
                    <td className="p-4 text-left w-1/5"> {employee.users.map((user) => user.email).join(", ")}</td>
                    <td className="p-4 text-left w-1/5">{formatUniqueId(employee.uniqueId)}</td>
                    <td className="p-4 w-1/5">{employee.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Use the Pagination component here */}
          <PaginationLayout
            currentPage={currentPage}
            totalPages={Math.ceil(employees.length / itemsPerPage)}
            nextPage={nextPage}
            prevPage={prevPage}
          />
        </div>
      </div>
    </div>
  );
}

export default EmployeeList;
