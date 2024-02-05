import React from "react";
import EmployeeList from "@/components/Business/EmployeeList";
import ProtectedPage from "@/components/ProtectedPage";

const AdminDashboard = () => {
  return (
    <ProtectedPage allowedRoles={["BUSINESS", "SUPER_ADMIN"]}>
      <EmployeeList />
    </ProtectedPage>
  );
};

export default AdminDashboard;
