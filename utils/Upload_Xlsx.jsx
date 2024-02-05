import { useState } from "react";
import * as XLSX from "xlsx";

const useFileFunctions = () => {
  const [parsedData, setParsedData] = useState(null);

  const handleFileUpload = (e) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = event.target.result;
      try {
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet);
        console.log("Parsed Data from XLSX File:", parsedData);
        setParsedData(parsedData);
      } catch (error) {
        console.error("Error reading XLSX file:", error);
      }
    };

    reader.onerror = (event) => {
      console.error("File reading failed:", event.target.error);
    };

    reader.readAsBinaryString(e.target.files[0]);
  };

  const downloadXLSX = () => {
    if (parsedData) {
      const worksheet = XLSX.utils.json_to_sheet(parsedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, "parsed_data.xlsx");
    }
  };

  return { handleFileUpload, downloadXLSX, parsedData };
};

export default useFileFunctions;
