import Modal from "@/components/Common/Modal";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import AddBia from "@/components/BIA/AddBiaForm";
import toast from "react-hot-toast";

export default function AddBiaModal({ setSuccess }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const addNewBia = async (biaData) => {
    try {
      const response = await fetch("/api/bias/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(biaData),
      });

      if (response.ok) {
        toast.success("BIA added successfully!");
        closeModal();
      } else {
        const data = await response.json();
        throw new Error(data.message);
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <>
      <button onClick={openModal} className="btn btn-primary mb-3 ml-4">
        <FontAwesomeIcon icon={faPlus} className="mr-2" />
        Add BIA
      </button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <AddBia addNewBia={addNewBia} />
      </Modal>
    </>
  );
}
