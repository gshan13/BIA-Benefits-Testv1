import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import "tailwindcss/tailwind.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx";
import { useSession } from "next-auth/react";
import { CATEGORY } from "@/utils/Category";
import { saveAs } from "file-saver";
import PaginationLayout from "@/components/PaginationLayout";
import Link from "next/link";
import Modal from "@/components/Common/Modal";
import AddBusiness from "@/components/BIA/AddBusiness";
import toast, { Toaster } from "react-hot-toast";

function BusinessList() {
  const [businesses, setBusinesses] = useState([]);
  const router = useRouter();
  const { data: session } = useSession();
  // const [showModal, setShowModal] = useRef();
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25; // Define the number of items per page
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  const openFileModal = () => {
    setFileModalOpen(true);
  };

  const closeFileModal = () => {
    setFileModalOpen(false);
  };

  const openModal = (bia) => {
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);
  const isSuperAdmin = session?.user?.role === "SUPER_ADMIN";

  const getCategoryName = (category) => {
    return CATEGORY[category] || category;
  };

  const fetchData = async () => {
    try {
      const response = await fetch("/api/business/");
      if (response.ok) {
        const data = await response.json();
        setBusinesses(data);
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

  const handleclick = () => {
    openModal();
  };

  const uploadCsv = () => {
    setShowModal(true);
  };

  const handleFileUpload = (e) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = event.target.result;
      try {
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet);
        const userEmail = session?.user?.email;
        setParsedData(parsedData);

        fetch("/api/business/xlsx/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: parsedData, userEmail: userEmail }),
        })
          .then(async (response) => {
            if (response.ok) {
              const responseData = await response.json();
              console.log("Data saved:", responseData);

              closeFileModal();
              toast.success("File uploaded successfully!");

              fetchData();

              // Return statement inside the fetch block
              return responseData;
            } else {
              const errorData = await response.json();
              console.error("Error uploading data:", errorData.error);
              setError("Upload Failed");

              const timer = setTimeout(() => {
                setError(null);
              }, 5000);

              clearTimeout(timer);
              return Promise.reject(errorData);
            }
          })
          .catch((error) => {
            console.error("Fetch error:", error);
            setError("Upload Failed");

            const timer = setTimeout(() => {
              setError(null);
            }, 5000);

            clearTimeout(timer);
            return Promise.reject(error);
          });
      } catch (error) {
        console.error("Error reading XLSX file:", error);
        setError("Upload Failed");
      }
    };

    reader.onerror = (event) => {
      console.error("File reading failed:", event.target.error);
      setError("Upload Failed");
    };

    reader.readAsBinaryString(e.target.files[0]);
  };

  const downloadXLSX = async () => {
    try {
      const response = await fetch("/api/business/xlsx/download");
      if (response.ok) {
        // Convert the response to a Blob
        const blob = await response.blob();

        // Create a download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "business_data.xlsx";
        document.body.appendChild(a);

        // Trigger a click event to download the file
        a.click();
        window.URL.revokeObjectURL(url);

        console.log("Download successful");
      } else {
        console.error("Failed to download data");
      }
    } catch (error) {
      console.error("Error while downloading data:", error);
    }
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
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = businesses.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () => {
    if (currentPage < Math.ceil(businesses.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  function capitalizeFirstLetter(str) {
    return str.replace(/\b\w/g, (match) => match.toUpperCase());
  }
  const itemsStart = (currentPage - 1) * itemsPerPage + 1;
  const itemsEnd = Math.min(currentPage * itemsPerPage, businesses.length);

  return (
    <div className="overflow-x-auto">
      <div>
        <Toaster />
      </div>
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

      <div className="business-container">
        <div className="flex justify-between items-center">
          <h1 className="table-title">
            Showing items {itemsStart} to {itemsEnd} out of {businesses.length}
          </h1>

          <div className="flex ml-auto space-x-3">
            {!isSuperAdmin && (
              <>
                <button className="btn btn-active btn-primary ml-3 mb-3" onClick={() => handleclick()}>
                  <FontAwesomeIcon icon={faPlus} />
                  Add Business
                </button>
                <button className="btn btn-active btn-primary ml-3 mb-3" onClick={openFileModal}>
                  Upload File
                </button>

                <button onClick={downloadXLSX} className="btn btn-primary  mb-3">
                  Export
                </button>
              </>
            )}
          </div>
        </div>
        <div className="table-container">
          <div className="overflow-x-hidden">
            <Modal isOpen={isModalOpen} onClose={closeModal} title="Add Business">
              <AddBusiness onClose={closeModal} />
            </Modal>
            <Modal isOpen={fileModalOpen} onClose={closeFileModal} title="Upload File">
              {/* File Upload Modal Content */}
              <div className="p-4">
                <h2 className="text-2xl font-semibold mb-6">File Upload</h2>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} />
              </div>
            </Modal>
            <div>
              <Toaster />
            </div>
            <table className="w-full p-2 rounded-lg" style={{ tableLayout: "fixed" }}>
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2 w-1/6 text-left pl-5">Business</th>
                  <th className="p-2 w-1/6 text-left pl-5">City</th>
                  <th className="p-2 w-1/6 text-left pl-5">Category</th>
                  <th className="p-2 w-1/6 text-left pl-5">Street</th>
                  <th className="p-2 w-1/6 text-left pl-5">Postal Code</th>
                  <th className="p-2 w-1/6 text-left pl-5">Unique Id</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((business) => (
                  <tr key={business.id} className="hover:bg-gray-100">
                    <Link href={`/business/${business.id}`}>
                      <td className="p-4 text-left w-1/6 cursor-pointer">{capitalizeFirstLetter(business.name)}</td>
                    </Link>
                    <td className="p-4 text-left w-1/6">{capitalizeFirstLetter(business.addresses[0]?.city)}</td>
                    <td className="p-4 text-left w-1/6">{getCategoryName(business.category)}</td>
                    <td className="p-4 text-left w-1/6">{capitalizeFirstLetter(business.street1)}</td>
                    <td className="p-4 text-left w-1/6">{business.postalCode.toUpperCase()}</td>
                    <td className="p-4 w-1/6">{formatUniqueId(business.uniqueId)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <PaginationLayout
          currentPage={currentPage}
          totalPages={Math.ceil(businesses.length / itemsPerPage)}
          nextPage={nextPage}
          prevPage={prevPage}
        />
      </div>
    </div>
  );
}
export default BusinessList;
