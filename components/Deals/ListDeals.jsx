import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import "tailwindcss/tailwind.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import PaginationLayout from "@/components/PaginationLayout";
import AddDeal from "./AddDeal";
import Modal from "../Common/Modal";
import toast, { Toaster } from "react-hot-toast";

function DealList() {
  const [deals, setDeals] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Define the number of items per page
  const [success, setSuccess] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [modalId, setModalId] = useState();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const router = useRouter();

  const fetchData = async () => {
    try {
      const response = await fetch("/api/deals/");
      if (response.ok) {
        const data = await response.json();
        setDeals(data);
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data. Please try again later.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addDeals = async (values) => {
    // Handle the creation of a new deal here
    try {
      const addressData = {
        province: Array.isArray(values.province) ? values.province.join(", ") : values.province,
        city: values.city,
        street1: values.street1,
        street2: values.street2 || null,
      };

      const newDeal = await fetch("/api/deals/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: values.title,
          corporatePartner: values.corporatePartner,
          addresses: [addressData],
          description: values.description,
        }),
      });

      if (newDeal.ok) {
        console.log("Deal added successfully!");
        router.push({
          pathname: "/deals",
          query: { success: "Deal added successfully!" },
        });
        toast.success("Deal added successfully!");
        closeModal();
        fetchData();
      } else {
        const data = await newDeal.json();
        console.error(`Failed to add Deal: ${data.error}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Calculate the range of items to display based on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = deals.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () => {
    if (currentPage < Math.ceil(deals.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const itemsStart = (currentPage - 1) * itemsPerPage + 1;
  const itemsEnd = Math.min(currentPage * itemsPerPage, deals.length);

  const handleclick = () => {
    router.push("/deals/new");
  };
  //   const handleRowClick = (id) => {
  //     router.push(`/bias/${id}`);
  //   };
  function capitalizeFirstLetter(str) {
    return str.replace(/(\b\w|\s\d)/g, (match) => match.toUpperCase());
  }
  return (
    <div className="overflow-x-auto">
      <div>
        <Toaster />
      </div>
      <div className="text-sm breadcrumbs">
        <ul>
          <li>Deals</li>
        </ul>
      </div>

      <div className="bia-container">
        <div className="flex justify-between items-center">
          <h1 className="table-title">
            Showing items {itemsStart} to {itemsEnd} out of {deals.length}
          </h1>
          <button className="btn btn-active btn-primary mb-3" onClick={openModal}>
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Deals
          </button>
        </div>
        <Modal modalId={2} isOpen={isModalOpen} onClose={closeModal}>
          <AddDeal addDeals={addDeals} />
        </Modal>
        <div className="table-container">
          <div className="table-container">
            <div className="overflow-x-hidden">
              <table className="w-full p-2 rounded-lg ">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-2 w-1/4 text-left pl-5">Title</th>
                    <th className="p-2 w-1/4 text-left pl-5">Corporate Sponsor</th>
                    <th className="p-2 w-1/4 text-left pl-5">Province</th>
                    <th className="p-2 w-1/4 text-left pl-5">City</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((deal, index) => (
                    <tr key={deal.id} className="hover:bg-gray-100">
                      <Link href={`/deals/${deal.id}`}>
                        <td className="p-4 w-1/4" style={{ cursor: "pointer" }}>
                          {capitalizeFirstLetter(deal.title)}
                        </td>
                      </Link>
                      <td className="p-4 w-1/4">{capitalizeFirstLetter(deal.corporatePartner)}</td>
                      <td className="p-4 w-1/4">{capitalizeFirstLetter(deal.addresses[0]?.province)}</td>
                      <td className="p-4 w-1/4">{capitalizeFirstLetter(deal.addresses[0]?.city)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Use the Pagination component here */}
          <PaginationLayout
            currentPage={currentPage}
            totalPages={Math.ceil(deals.length / itemsPerPage)}
            nextPage={nextPage}
            prevPage={prevPage}
          />
        </div>
      </div>
    </div>
  );
}

export default DealList;
