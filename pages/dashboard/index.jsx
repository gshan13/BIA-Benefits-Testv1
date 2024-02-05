import ProtectedPage from "@/components/ProtectedPage";
import MembershipCard from "@/components/Dashboard/MembershipCard";
import DashboardCard from "@/components/Dashboard/DashboardCard";
import { useSession } from "next-auth/react";

const Home = () => {
  const { data: session } = useSession();

  return (
    <ProtectedPage>
      {session && session.user && (
        <>
          {session.user.role === "SUPER_ADMIN" && <DashboardCard />}
          {session.user.role === "BIA" && session.user.bia && (
            <>
              <h4>Logged in as BIA</h4>
              <MembershipCard name={session.user.name} uniqueId={session.user.bia.uniqueId} />
            </>
          )}
          {session.user.role === "BUSINESS" && (
            <>
              <h4>Logged in as Business</h4>
              <MembershipCard name={session.user.name} uniqueId={session.user.business.uniqueId} />
            </>
          )}
        </>
      )}
    </ProtectedPage>
  );
};

export default Home;
