import BussinessList from "@/components/BIA/BussinessList";
import ProtectedPage from "@/components/ProtectedPage";

const AdminDashboard = () => {
  return (
    <ProtectedPage allowedRoles={["SUPER_ADMIN", "BIA"]}>
      <BussinessList />
    </ProtectedPage>
  );
};

export default AdminDashboard;
