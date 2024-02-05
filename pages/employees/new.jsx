import ProtectedPage from "@/components/ProtectedPage";
import AddEmployees from "@/components/Business/AddEmployees";

const AdminDashboard = () => {
  return (
    <ProtectedPage allowedRoles={["BUSINESS", "SUPER_ADMIN"]}>
      <AddEmployees />
    </ProtectedPage>
  );
};

export default AdminDashboard;
