import { useState, Fragment } from "react";
import { useShop } from "../context/shopContext";
import { IoAdd, IoClose, IoChevronDownOutline } from "react-icons/io5";
import clsx from "clsx";
import { ShopPreview } from "../lib/types";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Dialog from "@radix-ui/react-dialog";
import { Transition } from "@headlessui/react";
import toast from "react-hot-toast";

const ShopsDropdownMenu = () => {
  const { shops, shop, currentShopId, setCurrentShopId } = useShop();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [shopName, setShopName] = useState<string>("Untitled shop");

  const { createShop } = useShop();

  const handleSaveEdit = async () => {
    try {
      const newShop = {
        name: shopName,
        menu_ids: [],
        cover_image: null,
        logo: null,
        phone_number: null,
        address: null,
      };
      await createShop(newShop);
    } catch (error) {
      alert(error);
    } finally {
      toast.success("New shop created!");
      setShopName("Untitled shop");
    }
  };

  const switchShop = (shop: ShopPreview) => {
    setCurrentShopId(shop.id);
    toast(`Now viewing\n${shop.name} #${shop.username}`, {
      icon: "👏",
    });
  };

  return (
    <div>
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        {shops.length > 0 ? (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger
              className={clsx(
                "inline-flex select-none items-center justify-center rounded-md px-4 py-2 font-medium",
                "bg-white text-sm text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 dark:hover:text-white",
                "border dark:border-gray-700",
                "focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75",
                "group",
                "radix-state-delayed-open:bg-gray-50 radix-state-instant-open:bg-gray-50"
              )}
            >
              <span>Go to other shop</span>
              <IoChevronDownOutline
                className={clsx(
                  "ml-2 h-4 w-4 shrink-0 text-gray-700 ease-in-out dark:text-gray-400",
                  "group-radix-state-open:rotate-180 group-radix-state-open:duration-300",
                  "dark:group-hover:text-gray-100"
                )}
              />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={5}
                className={clsx(
                  " radix-side-top:animate-slide-up radix-side-bottom:animate-slide-down",
                  "z-50 w-48 rounded-lg border border-gray-200 px-1.5 py-1 shadow-md dark:border-gray-700 md:w-56",
                  "bg-white dark:bg-gray-800"
                )}
              >
                <DropdownMenu.Item
                  disabled
                  className={clsx(
                    "flex cursor-default select-none items-center rounded-md px-2 py-2 text-xs outline-none",
                    "text-gray-400 focus:bg-gray-50 dark:text-gray-500 dark:focus:bg-gray-900"
                  )}
                >
                  <span className="flex-grow text-gray-700 dark:text-gray-300">
                    <p className="text-gray-500 dark:text-gray-400">
                      Now viewing
                    </p>
                    <p className="font-medium text-gray-800 dark:text-gray-300">
                      {shop.name}{" "}
                      <span className="text-gray-400 dark:text-gray-500">
                        #{shop.username}
                      </span>
                    </p>
                  </span>
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
                {shops.length > 1 && (
                  <>
                    {shops
                      .filter(({ id }) => id != currentShopId)
                      .map((shop) => (
                        <DropdownMenu.Item
                          key={shop.id}
                          className={clsx(
                            "flex cursor-pointer select-none items-center rounded-md px-2 py-2 text-xs outline-none",
                            "text-gray-400 focus:bg-gray-50 dark:text-gray-500 dark:focus:bg-gray-900"
                          )}
                          onClick={() => switchShop(shop)}
                        >
                          <span className="flex-grow text-gray-700 dark:text-gray-300">
                            {shop.name}{" "}
                            <span className="text-gray-400 dark:text-gray-500">
                              #{shop.username}
                            </span>
                          </span>
                        </DropdownMenu.Item>
                      ))}
                    <DropdownMenu.Separator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
                  </>
                )}
                <DropdownMenu.Item asChild>
                  <Dialog.Trigger
                    className={clsx(
                      "flex w-full cursor-pointer select-none items-center rounded-md px-2 py-2 text-xs outline-none",
                      "text-gray-400 focus:bg-gray-50 dark:text-gray-500 dark:focus:bg-gray-900"
                    )}
                    onClick={() => setIsOpen(true)}
                  >
                    <IoAdd className="mr-2 h-3.5 w-3.5" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Create new shop
                    </span>
                  </Dialog.Trigger>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        ) : (
          <Dialog.Trigger className="flex w-fit items-center gap-x-1.5 rounded-md bg-blue-500 py-2 px-3 text-sm text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700">
            <IoAdd className="h-4 w-4" />
            New Shop
          </Dialog.Trigger>
        )}
        <Transition.Root show={isOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay
              forceMount
              className="fixed inset-0 z-20 bg-black/50"
            />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Content
              forceMount
              className={clsx(
                "fixed z-50",
                "w-[95vw] max-w-md rounded-lg p-4 md:w-full",
                "top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]",
                "bg-white dark:bg-gray-800",
                "focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75"
              )}
            >
              <Dialog.Title className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Edit shop name
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-sm font-normal text-gray-700 dark:text-gray-400">
                Make changes to your shop here. Click save when you&apos;re
                done.
              </Dialog.Description>
              <form
                className="mt-2 space-y-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveEdit();
                  setIsOpen(false);
                }}
              >
                <fieldset>
                  <label
                    htmlFor="shopName"
                    className="text-xs font-medium text-gray-700 dark:text-gray-400"
                  >
                    Shop name
                  </label>
                  <input
                    id="shopName"
                    type="text"
                    placeholder="Shop name"
                    className={clsx(
                      "mt-1 block w-full rounded-md",
                      "text-sm text-gray-700 placeholder:text-gray-500 dark:text-gray-400 dark:placeholder:text-gray-600",
                      "border border-gray-400 focus-visible:border-transparent dark:border-gray-700 dark:bg-gray-800",
                      "focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75"
                    )}
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                  />
                </fieldset>
              </form>

              <div className="mt-4 flex justify-end">
                <Dialog.Close
                  className={clsx(
                    "inline-flex select-none justify-center rounded-md px-4 py-2 text-sm font-medium",
                    "bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-700 dark:text-gray-100 dark:hover:bg-blue-600",
                    "border border-transparent",
                    "focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75"
                  )}
                  onClick={handleSaveEdit}
                  disabled={shopName === ""}
                >
                  Save
                </Dialog.Close>
              </div>

              <Dialog.Close
                className={clsx(
                  "absolute top-3.5 right-3.5 inline-flex items-center justify-center rounded-full p-1",
                  "focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75"
                )}
              >
                <IoClose className="h-4 w-4 text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-400" />
              </Dialog.Close>
            </Dialog.Content>
          </Transition.Child>
        </Transition.Root>
      </Dialog.Root>
    </div>
  );
};

export default ShopsDropdownMenu;
