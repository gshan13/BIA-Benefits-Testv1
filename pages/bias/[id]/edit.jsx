import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import provinces from "@/utils/provinces";
import toast, { Toaster } from "react-hot-toast";

const EditBia = ({ id, onClose }) => {
  const router = useRouter();

  const [biaData, setBiaData] = useState({
    nameOfBia: "",
    phBia: "",
    addresses: [
      {
        postalCode: "",
        province: "",
        city: "",
        street1: "",
        street2: "",
      },
    ],
    personOfContact: "",
    emailOfContact: "",
    phPersonOfContact: "",
  });

  useEffect(() => {
    let isMounted = true;

    const fetchBiaData = async () => {
      if (id) {
        try {
          const response = await fetch(`/api/bias/${id}`);
          if (response.ok) {
            const data = await response.json();
            if (isMounted) {
              setBiaData(data);
            }
          } else {
            console.error("Failed to fetch BIA data");
          }
        } catch (error) {
          console.error("Error fetching BIA data:", error);
        }
      }
    };

    fetchBiaData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBiaData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProvinceChange = (e) => {
    const { name, value } = e.target;
    setBiaData((prevData) => ({
      ...prevData,
      addresses: [
        {
          ...prevData.addresses[0],
          [name]: value,
        },
      ],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/bias/${id}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(biaData),
      });

      if (response.ok) {
        console.log("BIA updated successfully!");
        onClose();
        toast.success("BIA Updated successfully!");
        router.push({
          pathname: "/bias/",
          query: {
            updateSuccess: "BIA updated successfully!",
            highlightId: id,
          },
        });
      } else {
        console.error("Failed to update BIA data");
      }
    } catch (error) {
      console.error("Error updating BIA data:", error);
    }
  };

  return (
    <div className="p-4">
      <div>
        <Toaster />
      </div>
      <h1 className="text-2xl font-bold mb-4">Edit BIA</h1>
      {biaData && (
        <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-lg font-medium text-gray-700">Name of BIA:</label>
            <input
              type="text"
              name="nameOfBia"
              value={biaData.nameOfBia}
              onChange={handleInputChange}
              className="block w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700">BIA Phone Number:</label>
            <input
              type="text"
              name="phBia"
              value={biaData.phBia}
              onChange={handleInputChange}
              className="block w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700">Postal Code:</label>
            <input
              type="text"
              name="postalCode"
              value={biaData.addresses[0]?.postalCode}
              onChange={handleProvinceChange}
              className="block w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700">Province:</label>
            <select
              name="province"
              value={biaData.addresses[0]?.province}
              onChange={handleProvinceChange}
              className="block w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
            >
              {provinces.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700">City:</label>
            <input
              type="text"
              name="city"
              value={biaData.addresses[0]?.city}
              onChange={handleProvinceChange}
              className="block w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700">Street 1:</label>
            <input
              type="text"
              name="street1"
              value={biaData.addresses[0]?.street1}
              onChange={handleProvinceChange}
              className="block w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700">Street 2 (Optional):</label>
            <input
              type="text"
              name="street2"
              value={biaData.addresses[0]?.street2}
              onChange={handleProvinceChange}
              className="block w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700">Contact Person Name:</label>
            <input
              type="text"
              name="personOfContact"
              value={biaData.personOfContact}
              onChange={handleInputChange}
              className="block w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700">Email of Contact:</label>
            <input
              type="email"
              name="emailOfContact"
              value={biaData.emailOfContact}
              onChange={handleInputChange}
              className="block w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700">Contact Person Phone Number:</label>
            <input
              type="text"
              name="phPersonOfContact"
              value={biaData.phPersonOfContact}
              onChange={handleInputChange}
              className="block w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <button type="submit" className="btn btn-primary w-full mt-6">
            Update
          </button>
        </form>
      )}
    </div>
  );
};

export default EditBia;
