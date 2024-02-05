import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const ProtectedPage = ({ allowedRoles, children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin ml-50 w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full"></div>
      </div>
    );
  }

  if (!session) {
    // If the user is not logged in, redirect to the login page
    router.push("/auth/login");
    return null;
  }

  if (allowedRoles && Array.isArray(allowedRoles) && !allowedRoles.includes(session.user.role)) {
    // If the user's role is not in the allowedRoles array, redirect to a forbidden page or show an error message
    router.push("/home"); // You can customize the URL for forbidden access
    return null;
  }

  return children;
};

export default ProtectedPage;
