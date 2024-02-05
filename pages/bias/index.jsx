import ProtectedPage from "@/components/ProtectedPage";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import PaginationLayout from "@/components/PaginationLayout";
import AddBiaModal from "@/components/BIA/AddBiaModal";
import EditBia from "@/pages/bias/[id]/edit";

const AdminDashboard = () => {
  const [bias, setBias] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [modalId, setModalId] = useState();

  const itemsPerPage = 10;

  const openEditModal = (bia) => {
    setModalId(bia.id);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setModalId(null);
  };

  const highlightSearchTerm = (text, searchTerm) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text.split(regex).map((part, index) => (regex.test(part) ? <mark key={index}>{part}</mark> : part));
  };
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedItems(selectAll ? [] : bias.map((bia) => bia.id));
  };

  const handleSelectItem = (itemId) => {
    const updatedSelectedItems = selectedItems.includes(itemId)
      ? selectedItems.filter((id) => id !== itemId)
      : [...selectedItems, itemId];

    setSelectedItems(updatedSelectedItems);
  };

  const filteredBias = bias.filter(
    (bia) =>
      bia.nameOfBia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bia.uniqueId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bia.addresses[0]?.province.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bia.addresses[0]?.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bia.emailOfContact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchBIAS = async () => {
      try {
        const response = await fetch("/api/bias");
        if (response.ok) {
          const data = await response.json();
          setBias(data);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data. Please try again later.");
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    fetchBIAS();
  }, []);

  // Function to format uniqueId like a credit card number
  function formatUniqueId(uniqueId) {
    const formattedUniqueId = uniqueId
      .toString()
      .replace(/\s/g, "") // Remove any existing spaces
      .replace(/(\d{4})/g, "$1 "); // Add a space after every four digits
    return formattedUniqueId.trim();
  }

  const addNewBia = async (biaData) => {
    toast.success("BIA added successfully!");
  };

  const downloadAllData = async () => {
    try {
      // Extract BIA IDs of the selected items
      const selectedBiaIds = selectedItems.map((itemId) => bias.find((bia) => bia.id === itemId)?.id);
      console.log("selected bia id", selectedBiaIds);
      // Check if any BIA is selected
      if (!selectedBiaIds || selectedBiaIds.length === 0) {
        console.error("No BIA selected for download");
        return;
      }

      const response = await fetch(`/api/bias/xlsx/download?biaIds=${selectedBiaIds.join(",")}`);
      if (response.ok) {
        // Trigger the download on the client side
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "User_report.xlsx";
        document.body.appendChild(a);
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBias.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () => {
    if (currentPage < Math.ceil(bias.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const itemsStart = (currentPage - 1) * itemsPerPage + 1;
  const itemsEnd = Math.min(currentPage * itemsPerPage, filteredBias.length);

  function capitalizeFirstLetter(str) {
    return str.replace(/\b\w/g, (match) => match.toUpperCase());
  }

  return (
    <ProtectedPage allowedRoles={["SUPER_ADMIN"]}>
      <div className="flex justify-between items-center my-2">
        <h1 className="text-3xl font-bold">BIA Listing</h1>

        <input
          type="text"
          placeholder="Search for a BIA"
          className="input input-bordered"
          value={searchTerm}
          onChange={() => {
            setSearchTerm(e.target.value.toString());
          }}
        />
      </div>

      <div className="bia-container">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="table-title">
              {filteredBias.length === 0
                ? `Showing 0 of BIA's`
                : `Showing BIA's ${itemsStart} to ${itemsEnd} out of ${filteredBias.length}`}
            </h1>
          </div>

          {/* // Can this be a component? */}
          <div className="flex justify-end">
            <button className="btn btn-primary mb-3 ml-4" onClick={downloadAllData}>
              Download
            </button>
            <AddBiaModal addNewBia={addNewBia} />
          </div>
        </div>
        {searchTerm && <p>You have {filteredBias.length} BIA(s) matching your search.</p>}
        {loading ? (
          <div className="loading loading-ring loading-lg"></div>
        ) : (
          <div className="table-container">
            <div className="overflow-x-hidden">
              <table className="w-full p-2 rounded-lg" style={{ tableLayout: "fixed" }}>
                <thead className="bg-gray-200">
                  <tr className="table-header">
                    <th className="p-2 " style={{ width: "5%" }}>
                      <label>
                        <input type="checkbox" className="checkbox" checked={selectAll} onChange={handleSelectAll} />
                      </label>
                    </th>
                    <th className="p-2 text-left" style={{ width: "18%" }}>
                      BIA
                    </th>
                    <th className="p-2 text-left" style={{ width: "17%" }}>
                      Name of Contact
                    </th>
                    <th className="p-2 text-left" style={{ width: "20%" }}>
                      Contact Email
                    </th>
                    <th className="p-2 text-left" style={{ width: "10%" }}>
                      City
                    </th>
                    <th className="p-2 text-left" style={{ width: "10%" }}>
                      Province
                    </th>
                    <th className="p-2 text-left" style={{ width: "10%" }}>
                      Unique Id
                    </th>
                    <th className="p-2 text-left" style={{ width: "5%" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((bia, index) => (
                    <tr key={bia.id} className={`hover:bg-gray-100 `}>
                      <th>
                        <label>
                          <input
                            type="checkbox"
                            className="checkbox"
                            checked={selectedItems.includes(bia.id)}
                            onChange={() => handleSelectItem(bia.id)}
                          />
                        </label>
                      </th>
                      <td style={{ maxWidth: "15%", overflow: "hidden" }}>
                        <Link href={`/bias/${bia.id}`}>
                          {highlightSearchTerm(capitalizeFirstLetter(bia.nameOfBia), searchTerm)}
                        </Link>
                      </td>
                      <td style={{ maxWidth: "15%" }}>{capitalizeFirstLetter(bia.personOfContact)}</td>
                      <td
                        style={{
                          maxWidth: "15%",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {highlightSearchTerm(bia.emailOfContact, searchTerm)}
                      </td>
                      <td style={{ maxWidth: "15%" }}>
                        {highlightSearchTerm(capitalizeFirstLetter(bia.addresses[0]?.city), searchTerm)}
                      </td>
                      <td style={{ maxWidth: "15%" }}>
                        {highlightSearchTerm(capitalizeFirstLetter(bia.addresses[0]?.province), searchTerm)}
                      </td>
                      <td style={{ maxWidth: "10%", whiteSpace: "nowrap" }}>
                        {highlightSearchTerm(formatUniqueId(bia.uniqueId), searchTerm)}
                      </td>
                      <td style={{ maxWidth: "10%" }}>
                        <span className="inline-block bg-gray-200 p-2 rounded" onClick={() => openEditModal(bia)}>
                          <FontAwesomeIcon icon={faEdit} className="cursor-pointer" />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {modalId && (
          <Modal modalId={modalId} isOpen={isEditModalOpen} onClose={closeModal} title="Edit BIA">
            <EditBia id={modalId} onClose={closeEditModal} />
          </Modal>
        )}

        <PaginationLayout
          currentPage={currentPage}
          totalPages={Math.ceil(bias.length / itemsPerPage)}
          nextPage={nextPage}
          prevPage={prevPage}
        />
      </div>
    </ProtectedPage>
  );
};

export default AdminDashboard;
