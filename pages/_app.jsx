import { SessionProvider } from "next-auth/react";
import Header from "@/components/Header";
import "../styles/globals.css";
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Toaster />
      <Header />
      <main className="h-[calc(100vh-4rem)] px-2 max-w-screen-xl pt-4 m-auto">
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  );
}

export default MyApp;
