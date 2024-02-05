import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const DealDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [deal, setDeal] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/deals/${id}`);
        const data = await response.json();
        setDeal(data);
      } catch (error) {
        console.error("Error fetching deal details:", error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (!deal) {
    return <p className="text-center mt-8 text-gray-700">Loading...</p>;
  }

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg border mt-4 p-6">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Deal Details</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Information about the deal.</p>
      </div>

      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Deal Title</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{deal.title}</dd>
          </div>

          <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Corporate Partner</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{deal.corporatePartner}</dd>
          </div>

          <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Description</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{deal.description || "N/A"}</dd>
          </div>

          <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">City</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{deal?.addresses[0]?.city}</dd>
          </div>
          <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Province</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{deal?.addresses[0]?.province}</dd>
          </div>
          <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Street Address 1</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{deal?.addresses[0]?.street1}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default DealDetails;
