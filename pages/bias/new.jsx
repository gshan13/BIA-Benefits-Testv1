import AddBia from "../../components/BIA/AddBiaForm";
import React from "react";
import ProtectedPage from "@/components/ProtectedPage";

const AdminDashboard = () => {
  return (
    <div>
      <ProtectedPage allowedRoles={["SUPER_ADMIN"]}>
        <AddBia />
      </ProtectedPage>
    </div>
  );
};

export default AdminDashboard;
