import React from "react";
import AddDeals from "@/components/Deals/AddDeal";
import ProtectedPage from "@/components/ProtectedPage";

const AdminDashboard = () => {
  return (
    <ProtectedPage allowedRoles={["SUPER_ADMIN"]}>
      <AddDeals />
    </ProtectedPage>
  );
};

export default AdminDashboard;
