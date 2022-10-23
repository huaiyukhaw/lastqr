import "../styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "../context/authContext";
import { ShopProvider } from "../context/shopContext";
import { Toaster } from "react-hot-toast";
import dynamic from "next/dynamic";

const ProgressBar = dynamic(() => import("../components/ProgressBar"), {
  ssr: false,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ShopProvider>
        <Component {...pageProps} />
        <Toaster />
        <ProgressBar />
      </ShopProvider>
    </AuthProvider>
  );
}

export default MyApp;
