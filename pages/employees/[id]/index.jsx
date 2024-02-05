import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import ProtectedPage from "@/components/ProtectedPage";

function EmployeeDetails() {
  const [employee, setEmployee] = useState(null);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          // Fetch employee data
          const employeeResponse = await fetch(`/api/employees/${id}`);
          if (employeeResponse.ok) {
            const employeeData = await employeeResponse.json();
            console.log(employeeData);

            setEmployee(employeeData);
          } else {
            console.error("Failed to fetch Employee data:", employeeResponse);
            throw new Error("Failed to fetch Employee data");
          }
        } catch (error) {
          console.error(error);
        }
      };

      fetchData();
    }
  }, [id]);

  return (
    <ProtectedPage allowedRoles={["SUPER_ADMIN", "BIA", "BUSINESS"]}>
      <div className="overflow-x-auto">
        <div className="text-sm breadcrumbs">
          <ul>
            <li>
              <Link className="font-bold" href={"/bias/"}>
                BIA's
              </Link>
            </li>
            <li>
              {employee?.business?.bia && (
                <Link className="font-bold" href={`/bias/${employee.business.bia.id}`}>
                  {employee.business.bia.name}
                </Link>
              )}
            </li>

            <li>
              {employee?.business && (
                <Link className="font-bold" href={`/business/${employee.business.id}`}>
                  {employee.business.name}
                </Link>
              )}
            </li>
            <li className="font-bold" key={employee?.id}>
              {employee?.first_name}
            </li>
          </ul>
        </div>
        <div className="flex justify-end mt-3">
          <Link
            className="btn btn-primary"
            href={{
              pathname: "/employees/new",
              query: { businessId: employee?.business?.id },
            }}
          >
            Add Employee
          </Link>
        </div>

        {employee ? (
          <div className="bg-white overflow-hidden shadow rounded-lg border mt-4 p-6">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Employee Details</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Information about the employee.</p>
            </div>

            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Employee Name</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {employee ? employee.first_name : "Loading..."}
                  </dd>
                </div>

                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Contact Number</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {employee ? employee.phone : "N/A"}
                  </dd>
                </div>

                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Business</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {employee?.business?.name || "N/A"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        ) : (
          <p className="text-gray-700 text-xl font-semibold">Loading Employee details...</p>
        )}
      </div>
    </ProtectedPage>
  );
}

export default EmployeeDetails;
