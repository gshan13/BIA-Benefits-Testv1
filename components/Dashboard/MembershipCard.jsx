import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Barcode from "react-barcode";

const MembershipCard = ({ name, uniqueId }) => {
  const [bar, setBar] = useState("");
  const cardRef = useRef(null);

  function formatUniqueId(uniqueId) {
    if (uniqueId !== null) {
      const formattedUniqueId = uniqueId
        .toString()
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ");
      return formattedUniqueId.trim();
    } else {
      return "N/A";
    }
  }
  function barCode(e) {
    setBar(e);
  }

  const downloadAsPDF = () => {
    const cardElement = cardRef.current;

    html2canvas(cardElement, {
      scale: 5,
      ignoreElements: (element) => element.tagName === "BUTTON",
      backgroundColor: null, // Set backgroundColor to null to remove the white background
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ unit: "px", format: "a4" });
      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        cardElement.offsetWidth,
        cardElement.offsetHeight
      );
      pdf.save("membership_card.pdf");
    });
  };

  return (
    <div className="flex flex-col mt-5 items-center">
      <div
        className="card w-96 h-30 bg-gradient-to-r from-black via-gray-800 to-purple-500 text-primary-content relative p-4 border-2 border-purple-500 shadow-xl bg-cover bg-center"
        style={{ backgroundImage: "url('/img/66562.jpg')" }}
        ref={cardRef}
      >
        <div className="card-body flex flex-col items-center justify-center relative">
          <h2 className="card-title text-white absolute top-2 left-2">
            BIA Benefits
          </h2>
          <div className="barcode-container text-center text-white text-lg font-bold relative top-5">
            <Barcode
              value={bar ? bar : `${formatUniqueId(uniqueId)}`}
              lineColor="black"
            />
          </div>
        </div>

        <div className="card-actions flex justify-between items-end p-4">
          <div className="flex flex-col">
            <h3 className="card-title text-white mb-2">Name</h3>
            <p className="card-title text-white text-sm">{name}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <button
          onClick={downloadAsPDF}
          className="btn btn-active btn-primary ml-3 mb-3"
        >
          Download Your Virtual CARD
        </button>
      </div>
    </div>
  );
};

export default MembershipCard;
