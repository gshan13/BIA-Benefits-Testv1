import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import "tailwindcss/tailwind.css"; // Import Tailwind CSS styles
// import AdminLayout from "@/admin_dashboards/AdminLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import ProtectedPage from "@/components/ProtectedPage";
import PaginationLayout from "@/components/PaginationLayout";
import Modal from "@/components/Common/Modal";
import AddBusiness from "@/components/BIA/AddBusiness";
import toast, { Toaster } from "react-hot-toast";

const BIA = () => {
  const router = useRouter();
  const { id } = router.query;
  const businessItemsPerPage = 5;

  // State
  const [bia, setBia] = useState(null);
  const [businessCurrentPage, setBusinessCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalId, setModalId] = useState();

  const openModal = (bia) => {
    setModalId(bia.id);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/bias/${id}`);
        if (response.ok) {
          const data = await response.json();
          setBia(data);
        } else {
          throw new Error("Failed to fetch BIA data");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  const businessStartIndex = (businessCurrentPage - 1) * businessItemsPerPage;
  const businessEndIndex = businessStartIndex + businessItemsPerPage;
  const currentBusinesses = bia?.businesses.slice(businessStartIndex, businessEndIndex);

  const businessNextPage = () => {
    const totalBusinesses = bia?.businesses.length || 0;
    const totalPages = Math.ceil(totalBusinesses / businessItemsPerPage);
    if (businessCurrentPage < totalPages) {
      setBusinessCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const businessPrevPage = () => {
    console.log("Next page clicked");
    if (businessCurrentPage > 1) {
      setBusinessCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <ProtectedPage allowedRoles={["SUPER_ADMIN"]}>
      <div className="overflow-x-auto">
        {bia && (
          <div className="text-sm breadcrumbs">
            <ul>
              <li>
                <Link href={"/bias/"} className="font-bold">
                  BIA's
                </Link>
              </li>
              <li>
                <Link href={`/bias/${bia.id}`} className="font-bold">
                  {bia.nameOfBia}
                </Link>
              </li>
            </ul>
          </div>
        )}
        <div className="bg-white overflow-hidden shadow rounded-lg border mt-4 p-6">
          <div className="px-4 py-5 sm:px-6">
            <h1 className="text-3xl font-bold"> {bia ? bia.nameOfBia : "Loading..."}</h1>
          </div>

          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Contact Person</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {bia ? bia.personOfContact : "Loading..."}
                </dd>
              </div>
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Contact Email</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {bia ? bia.emailOfContact : "Loading..."}
                </dd>
              </div>
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">City</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{bia?.addresses[0]?.city || "N/A"}</dd>
              </div>
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Province</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {bia?.addresses[0]?.province || "N/A"}
                </dd>
              </div>
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Street Address</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {bia?.addresses[0]?.street1 || "N/A"}
                </dd>
              </div>
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Postal Code</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {bia?.addresses[0]?.postalCode ? bia?.addresses[0]?.postalCode.toUpperCase() : "N/A"}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Business List Card */}
        <div className="bg-white  shadow rounded-lg border mt-4 p-6">
          <div className=" text-right">
            <span
              className="btn btn-primary"
              onClick={() => openModal(bia)}
              href={{
                pathname: "/business/add",
                query: { biaID: bia?.id },
              }}
            >
              Add Business
            </span>
          </div>
          {modalId && (
            <Modal modalId={modalId} isOpen={isModalOpen} onClose={closeModal} title="Add Bussiness">
              <AddBusiness id={modalId} onClose={closeModal} />
            </Modal>
          )}

          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Businesses under {bia?.nameOfBia}</h3>
          </div>

          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <table className="w-full p-2 rounded-lg overflow-hidden">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2 w-1/5 text-left pl-5">Business</th>
                  <th className="p-2 w-1/5 text-left pl-5">City</th>
                  <th className="p-2 w-1/5 text-left pl-5">Category</th>
                  <th className="p-2 pl-12 w-1/4 text-left ">Postal Code</th>
                  <th className="p-2 w-1/5 text-left pl-5">Unique Id</th>
                </tr>
              </thead>
            </table>

            {currentBusinesses && currentBusinesses.length > 0 ? (
              <ul className="list-disc list-inside">
                {currentBusinesses.map((business) => (
                  <Link key={business.id} href={`/business/${business.id}`}>
                    <div className="overflow-x-hidden">
                      <table className="w-full p-2 rounded-lg overflow-hidden">
                        <tbody>
                          <tr key={business.id}>
                            <td className="p-4 text-left w-1/5 overflow-hidden">{business.name}</td>
                            <td className="p-4 text-left w-1/5 overflow-hidden">{business.addresses[0]?.city}</td>
                            <td className="p-4 text-left w-1/4 overflow-hidden">{business.category}</td>
                            <td className="p-4 text-left w-1/5 overflow-hidden">{business.addresses[0]?.postalCode}</td>
                            <td className="p-4 text-left w-1/5 overflow-hidden">{business.uniqueId}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </Link>
                ))}
              </ul>
            ) : (
              <p>No businesses found under {bia?.nameOfBia}</p>
            )}

            {/* Add PaginationLayout component */}
            <PaginationLayout
              currentPage={businessCurrentPage}
              totalPages={Math.ceil((bia?.businesses.length || 0) / businessItemsPerPage)}
              nextPage={businessNextPage}
              prevPage={businessPrevPage}
            />
          </div>
        </div>
      </div>
    </ProtectedPage>
  );
};

export default BIA;
