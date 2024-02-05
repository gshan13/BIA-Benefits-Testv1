import React, { useEffect, useRef } from "react";

const Modal = ({ isOpen, onClose, title, children }) => {
  const modal = useRef();

  useEffect(() => {
    if (isOpen) {
      modal.current.showModal();
    } else {
      modal.current.close();
    }
  }, [isOpen]);

  useEffect(() => {
    modal.current.addEventListener("close", onClose);
  }, []);

  return (
    <dialog className="modal" ref={modal}>
      <div className="max-w-5xl max-h-100 overflow-auto relative modal-box">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>

        <div className="flex flex-col h-full">
          <div className="mb-4 max-h-16 ">
            <h2 className="text-xl font-bold">{title}</h2>
          </div>
          <div className=" flex-grow">{children}</div>
        </div>
      </div>
    </dialog>
  );
};

export default Modal;
