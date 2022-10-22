import Image from "next/image";
import Link from "next/link";
import {
  IoFastFoodOutline,
  IoQrCodeOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { useAuth } from "../../context/authContext";
import ShopsDropdownMenu from "../../components/ShopsDropdownMenu";
import { useRouter } from "next/router";
import clsx from "clsx";
import { useShop } from "../../context/shopContext";
import { NextPage } from "next";
import { useEffect } from "react";

const AppLayout: NextPage = () => {
  const { session, loading } = useAuth();
  const { numberOfShops } = useShop();
  const router = useRouter();

  const routes = [
    {
      id: "1",
      path: "/app/menus",
      label: "Menus",
      Icon: IoFastFoodOutline,
    },
    {
      id: "2",
      path: "/app/qrcode",
      label: "QR code",
      Icon: IoQrCodeOutline,
    },
    {
      id: "3",
      path: "/app/settings",
      label: "Settings",
      Icon: IoSettingsOutline,
    },
  ];

  if (!session && !loading) {
    router.push("/login");
  }

  useEffect(() => {
    if (numberOfShops > 0) {
      router.push("/app/menus");
    }
  }, [numberOfShops]);

  return (
    <div className="flex h-screen flex-col bg-gray-100 dark:bg-gray-900 dark:text-white">
      <header
        className="z-50 flex h-16 w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800"
        aria-label="Global"
      >
        <div className="mx-auto flex w-full flex-wrap items-center justify-between gap-3 px-4 sm:flex-nowrap">
          {/* Logo */}
          <Link href="/app">
            <a className="flex-none text-xl font-semibold dark:text-white">
              <div className="flex items-center gap-1 drop-shadow-sm">
                <Image
                  src="/logo.png"
                  alt="LastQR logo"
                  width={28}
                  height={28}
                />
                <div className="font-semibold">
                  <span className="text-primary">Last</span>
                  <span className="text-secondary">QR</span>
                </div>
              </div>
            </a>
          </Link>
          <div className="fixed bottom-0 -mx-4 flex w-full items-center justify-evenly gap-5 border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800 lg:relative lg:mx-0 lg:w-fit lg:border-0">
            <nav className="-mb-0.5 flex justify-between space-x-6">
              {routes.map(({ id, label, Icon }) => {
                return (
                  <a
                    key={id}
                    className={clsx(
                      "inline-flex flex-col items-center gap-1 whitespace-nowrap px-4 pt-3 pb-2 text-xs font-medium lg:border-b-[3px]",
                      "cursor-not-allowed border-transparent text-gray-500 opacity-75 hover:text-gray-500"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {label}
                  </a>
                );
              })}
            </nav>
          </div>
          <ShopsDropdownMenu />
        </div>
      </header>
      <div className="flex-1 overflow-auto pb-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between gap-3 border-b border-gray-200 dark:border-gray-800">
            <h1 className="mt-8 mb-4 text-2xl font-medium">Get Started</h1>
            <ShopsDropdownMenu />
          </div>
          <div className="mt-6">
            <div className="rounded-lg bg-white drop-shadow dark:bg-gray-800">
              <div className="flex flex-col items-center justify-center gap-6 py-12 px-4">
                <Image
                  src="/no-shop.svg"
                  alt="No menu"
                  aria-hidden="true"
                  width={445}
                  height={332.42}
                />
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-800 dark:text-white">
                    No shops... yet!
                  </div>
                  <div className="mt-1 text-sm text-gray-800 dark:text-gray-300">
                    Create your first shop to get started
                  </div>
                </div>
                <ShopsDropdownMenu />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
