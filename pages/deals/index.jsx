// import React from "react";
// import AdminLayout from "@/admin_dashboards/AdminLayout";
import ListDeals from "@/components/Deals/ListDeals";
import ProtectedPage from "@/components/ProtectedPage";

const AdminDashboard = () => {
  return (
    <ProtectedPage allowedRoles={["SUPER_ADMIN"]}>
      <ListDeals />
    </ProtectedPage>
  );
};

export default AdminDashboard;
