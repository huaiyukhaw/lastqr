import Image from "next/image";
import Link from "next/link";
import {
  IoFastFoodOutline,
  IoQrCodeOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { useAuth } from "../context/authContext";
import ShopsDropdownMenu from "./ShopsDropdownMenu";
import { useRouter } from "next/router";
import clsx from "clsx";
import { useShop } from "../context/shopContext";
import { useEffect } from "react";

type AppLayoutProps = {
  children: React.ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps) => {
  const { session, loading } = useAuth();
  const { loaded, numberOfShops } = useShop();
  const router = useRouter();
  const currentPath = router.pathname;

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
    if (loaded && numberOfShops < 1) {
      router.push("/app/get-started");
    }
  }, [loaded, numberOfShops, router]);

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
              {routes.map(({ id, path, label, Icon }) => {
                return (
                  <Link href={path} key={id}>
                    <a
                      className={clsx(
                        "inline-flex flex-col items-center gap-1 whitespace-nowrap px-4 pt-3 pb-2 text-xs font-medium lg:border-b-[3px]",
                        currentPath === path
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-blue-600"
                      )}
                      aria-current={currentPath === path ? "page" : "false"}
                    >
                      <Icon className="h-5 w-5" />
                      {label}
                    </a>
                  </Link>
                );
              })}
            </nav>
          </div>
          <ShopsDropdownMenu />
        </div>
      </header>
      <div className="flex-1 overflow-auto pb-20">{children}</div>
    </div>
  );
};

export default AppLayout;
