import React from "react";
import ProtectedPage from "@/components/ProtectedPage";
import AddBusiness from "@/components/BIA/AddBusiness";

const AdminDashboard = () => {
  return (
    <ProtectedPage allowedRoles={["BIA", "SUPER_ADMIN"]}>
      <AddBusiness />
    </ProtectedPage>
  );
};

export default AdminDashboard;
