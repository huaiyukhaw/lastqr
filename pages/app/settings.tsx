import clsx from "clsx";
import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import AppLayout from "../../components/AppLayout";
import ShopCoverImage from "../../components/ShopCoverImage";
import { useAuth } from "../../context/authContext";
import { useShop } from "../../context/shopContext";
import { Shop } from "../../lib/types";
import AlertDialogComponent from "../../components/AlertDialog";
import toast from "react-hot-toast";

const SettingsPage: NextPage = () => {
  const { user, logOut } = useAuth();
  const { shop, updateShop, shutdownShop } = useShop();

  const [loadingIframe, setLoadingIFrame] = useState<boolean>(true);
  const [shopCoverImageUrl, setShopCoverImageUrl] =
    useState<Shop["cover_image"]>("");
  const [shopName, setShopName] = useState<Shop["name"]>("");
  const [shopPhoneNumber, setShopPhoneNumber] =
    useState<Shop["phone_number"]>("");
  const [shopAddress, setShopAddress] = useState<Shop["address"]>("");
  const [isOpen, setIsOpen] = useState(false);

  const refreshIframe = () => {
    setLoadingIFrame(true);
    const iframeEl = document.getElementById("shopIframe") as HTMLIFrameElement;
    iframeEl.src += "";
  };

  const handleSavePageEdit = async () => {
    const updateShopPromise = updateShop({
      ...shop,
      name: shopName,
      cover_image: shopCoverImageUrl,
      address: shopAddress,
      phone_number: shopPhoneNumber,
    });
    toast.promise(updateShopPromise, {
      loading: "Saving",
      success: "Saved!",
      error: "Error when saving.",
    });
    refreshIframe();
  };

  const handleDeleteShop = async () => {
    await shutdownShop(shop);
    toast.success("Shop deleted");
  };

  useEffect(() => {
    if (shop) {
      setShopCoverImageUrl(shop.cover_image);
      setShopName(shop.name ?? "");
      setShopPhoneNumber(shop.phone_number ?? "");
      setShopAddress(shop.address ?? "");
    }
  }, [shop]);

  return (
    <div>
      <Head>
        <title>Settings - LastQR</title>
        <meta name="description" content="Create menus QR using LastQR" />
      </Head>
      <AppLayout>
        <div className="mx-auto max-w-6xl px-4">
          <div className="border-b border-gray-200 dark:border-gray-800">
            <h1 className="mt-8 mb-4 text-2xl font-medium">Settings</h1>
          </div>
          <div className="mt-6 flex flex-col gap-5">
            <div className="flex flex-col items-start gap-2 gap-x-2 gap-y-4 rounded-lg drop-shadow sm:flex-row sm:items-center">
              <div className="flex-grow text-gray-700 dark:text-gray-300">
                <p className="text-gray-500 dark:text-gray-400">
                  Now logged in as
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {user?.email}
                </p>
              </div>
              <button
                type="button"
                className="flex w-fit items-center gap-x-1.5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-semibold hover:bg-gray-800 hover:text-white focus:ring-2 focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                onClick={() => logOut()}
              >
                Log out
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex h-fit w-full flex-col justify-between rounded-lg bg-white p-6 drop-shadow dark:bg-gray-800">
                <div className="flex flex-col gap-5 divide-y divide-gray-200 dark:divide-gray-700">
                  <div className="space-y-1">
                    <h1 className="text-xl font-medium">Public page</h1>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      It is important that you keep this information updated, as
                      it is the first thing your guests will see when they scan
                      the QR.
                    </p>
                  </div>
                  {/* Cover image */}
                  <div className="flex gap-4 pt-5">
                    <div className="mt-2 w-1/2 space-y-1">
                      <h1 className="text-sm font-medium">Cover image</h1>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Upload a photo of your establishment, if possible in
                        landscape format. Logos don&apos;t usually look good.
                      </p>
                    </div>
                    <div className="w-1/2 flex-none">
                      <ShopCoverImage
                        url={shopCoverImageUrl}
                        onUpload={async (url) => {
                          setShopCoverImageUrl(url);
                        }}
                      />
                    </div>
                  </div>
                  {/* Establishment name */}
                  <fieldset className="flex items-start gap-4 pt-5">
                    <label className="mt-2 w-1/2 space-y-1" htmlFor="shopName">
                      <h1 className="text-sm font-medium">
                        Establishment name
                      </h1>
                    </label>
                    <input
                      id="shopName"
                      type="text"
                      className={clsx(
                        "mt-1 block w-1/2 rounded-md",
                        "text-sm text-gray-700 placeholder:text-gray-500 dark:text-gray-400 dark:placeholder:text-gray-600",
                        "border border-gray-400 focus-visible:border-transparent dark:border-gray-700 dark:bg-gray-800",
                        "focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75"
                      )}
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      required
                    />
                  </fieldset>
                  {/* Phone number */}
                  <fieldset className="flex items-start gap-4 pt-5">
                    <label
                      className="mt-2 w-1/2 space-y-1"
                      htmlFor="shopPhoneNumber"
                    >
                      <h1 className="text-sm font-medium">Phone number</h1>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Provide your customers with the phone number so they can
                        call you.
                      </p>
                    </label>
                    <input
                      id="shopPhoneNumber"
                      type="tel"
                      className={clsx(
                        "mt-1 block w-1/2 rounded-md",
                        "text-sm text-gray-700 placeholder:text-gray-500 dark:text-gray-400 dark:placeholder:text-gray-600",
                        "border border-gray-400 focus-visible:border-transparent dark:border-gray-700 dark:bg-gray-800",
                        "focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75"
                      )}
                      value={shopPhoneNumber ?? ""}
                      onChange={(e) => setShopPhoneNumber(e.target.value)}
                      required
                    />
                  </fieldset>
                  {/* Address */}
                  <fieldset className="flex items-start gap-4 pt-5">
                    <label
                      className="mt-2 w-1/2 space-y-1"
                      htmlFor="shopAddress"
                    >
                      <h1 className="text-sm font-medium">Address</h1>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Enter the address so that they can find you physically.
                      </p>
                    </label>
                    <textarea
                      id="shopPhoneNumber"
                      rows={4}
                      className={clsx(
                        "mt-1 block w-1/2 rounded-md",
                        "text-sm text-gray-700 placeholder:text-gray-500 dark:text-gray-400 dark:placeholder:text-gray-600",
                        "border border-gray-400 focus-visible:border-transparent dark:border-gray-700 dark:bg-gray-800",
                        "focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75"
                      )}
                      value={shopAddress ?? ""}
                      onChange={(e) => setShopAddress(e.target.value)}
                      required
                    />
                  </fieldset>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    className="flex w-fit items-center gap-x-1.5 rounded-md bg-blue-500 py-2 px-3 text-sm text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700"
                    onClick={handleSavePageEdit}
                  >
                    Save
                  </button>
                </div>
              </div>
              <figure className="relative mx-auto h-auto min-w-[240px] w-full max-w-full flex-none basis-1/3">
                {shop.username && (
                  <iframe
                    id="shopIframe"
                    className={clsx(
                      "z-20 aspect-[1/2] h-full w-full rounded-3xl bg-gray-800 p-1.5 shadow-[0_2.75rem_5.5rem_-3.5rem_rgb(45_55_75_/_20%),_0_2rem_4rem_-2rem_rgb(45_55_75_/_30%),_inset_0_-0.1875rem_0.3125rem_0_rgb(45_55_75_/_20%)] dark:bg-gray-800 dark:shadow-[0_2.75rem_5.5rem_-3.5rem_rgb(0_0_0_/_20%),_0_2rem_4rem_-2rem_rgb(0_0_0_/_30%),_inset_0_-0.1875rem_0.3125rem_0_rgb(0_0_0_/_20%)]"
                    )}
                    src={`/m/${shop.username}`}
                    onLoad={() => setLoadingIFrame(false)}
                  />
                )}
                <div
                  className={clsx(
                    "absolute inset-0 z-0 flex items-center justify-center rounded-3xl bg-gray-800 transition-all duration-700",
                    loadingIframe ? "block opacity-100" : "hidden opacity-0"
                  )}
                >
                  <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                  <span>Loading</span>
                </div>
              </figure>
            </div>
            <div className="mt-6 text-xl font-medium">Danger Zone</div>
            <div className="flex flex-col items-start justify-between gap-x-2 gap-y-4 rounded-lg border border-red-500 bg-white px-4 py-6 drop-shadow dark:bg-gray-900 sm:flex-row sm:items-center">
              <div className="space-y-2">
                <div className="text-lg font-semibold">Delete this shop</div>
                <div>
                  Once you delete a shop, there is no going back. Please be
                  certain.
                </div>
              </div>
              <button
                type="button"
                className={clsx(
                  "flex w-fit items-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold focus:ring-2 focus:ring-red-500",
                  "border border-red-600 dark:border-gray-700",
                  "bg-white hover:bg-red-600 dark:bg-gray-800",
                  "text-red-600 hover:text-white dark:text-red-500"
                )}
                onClick={() => setIsOpen(true)}
              >
                Delete shop
              </button>
            </div>
          </div>
        </div>
        <AlertDialogComponent
          open={isOpen}
          onOpenChange={setIsOpen}
          action={handleDeleteShop}
        />
      </AppLayout>
    </div>
  );
};

export default SettingsPage;
