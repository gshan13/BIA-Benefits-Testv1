import { SessionProvider } from "next-auth/react";
import Header from "../components/Header";

const Layout = ({ children, session }) => {
  return (
    <SessionProvider session={session}>
      <main className="h-full px-2 max-w-screen-xl mt-[64px] m-auto">{children}</main>
    </SessionProvider>
  );
};

export default Layout;
