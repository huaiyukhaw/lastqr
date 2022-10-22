import "../styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "../context/authContext";
import { ShopProvider } from "../context/shopContext";
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ShopProvider>
        <Component {...pageProps} />
        <Toaster />
      </ShopProvider>
    </AuthProvider>
  );
}

export default MyApp;
