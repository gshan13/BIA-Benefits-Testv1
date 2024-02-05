import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const Header = () => {
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  function name(email) {
    if (email?.length > 0) {
      return email[0].toUpperCase();
    }
    return "";
  }

  const links = [
    { href: "/dashboard", label: "My Dashboard" },
    userRole === "SUPER_ADMIN" && { href: "/bias/", label: "BIA" },
    userRole === "SUPER_ADMIN" && { href: "/business/", label: "BUSINESS" },
    userRole === "SUPER_ADMIN" && { href: "/deals/", label: "DEALS" },
    userRole === "BIA" && { href: "/business/", label: "BUSINESS" },
    userRole === "BUSINESS" && { href: "/employees/", label: "EMPLOYEES" },
  ].filter(Boolean);

  return (
    <nav className="shadow-md sticky">
      <div className="navbar bg-white-800	max-w-screen-xl mx-auto ">
        <div className="navbar-start">
          <Link className="text-black text-sm font-semibold" href="/">
            <img src="/img/logo_bia.png" alt="BIA Logo" className="h-6" />
          </Link>
        </div>

        {session && (
          <div className="navbar-center">
            <ul className="menu menu-horizontal px-1">
              {links.map((link, index) => (
                <li className="text-center semibold px-2" key={index}>
                  <Link className="text-black text-sm font-semibold" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="navbar-end">
          {session ? (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle items-center ">
                <div className="bg-neutral-focus text-neutral-content rounded-full w-10 h-10 flex items-center justify-center text-center">
                  <span className="text-lg ">{name(session.user.email)}</span>
                </div>
              </label>
              <ul
                tabIndex={0}
                className="bg-white text-black font-bold  menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li className="hover:gray-300 cursor-pointer p-2 rounded-md" onClick={handleLogout}>
                  Logout
                </li>
              </ul>
            </div>
          ) : (
            <Link className="text-black text-sm font-semibold" href={"/auth/login"}>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
