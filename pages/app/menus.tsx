import { NextPage } from "next";
import AppLayout from "../../components/AppLayout";
import Head from "next/head";
import { useShop } from "../../context/shopContext";
import {
  IoClose,
  IoDuplicate,
  IoEllipsisHorizontal,
  IoTrash,
} from "react-icons/io5";
import { Menu } from "../../lib/types";
import Image from "next/image";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import clsx from "clsx";
import { useRouter } from "next/router";
import { HiPencil } from "react-icons/hi";
import { useEffect, useState, Fragment } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Transition } from "@headlessui/react";
import toast from "react-hot-toast";
import { nanoid } from "nanoid";
import { sampleMenu } from "../../data/sampleMenu";

const MenusPage: NextPage = () => {
  const { menus, getMenus, deleteMenu, currentShopId, createMenu } = useShop();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (currentShopId) {
      getMenus();
    }
    // cannot put getMenus in this dependencies array
    // will cause infinite api calls
  }, [currentShopId]);

  const getDishCount = (menu: Menu) => {
    let count = 0;
    menu.collections.forEach((collection) => {
      count = count + collection.items.length;
    });
    return count;
  };

  const createNewMenu = async () => {
    try {
      const newItemId = `item_${nanoid()}`;
      const newCollectionId = `col_${nanoid()}`;
      const newVariantId = `var_${nanoid()}`;
      const newMenuItem = {
        id: newItemId,
        name: "Untitled dish",
        description: null,
        variants: [
          {
            id: newVariantId,
            name: null,
            price: null,
          },
        ],
        collection_id: newCollectionId,
        image_url: null,
      };
      const newMenuCollection = {
        id: newCollectionId,
        name: "Untitled collection",
        description: "",
        items: [newMenuItem],
      };

      const newMenu: Menu = {
        name: "Untitled menu",
        collections: [newMenuCollection],
        items: [newMenuItem],
      };

      const { id } = await createMenu(newMenu);

      router.push(`/app/editor/${id}`);
    } catch (error) {
      console.error(error);
    } finally {
      toast.success("New menu created!");
    }
  };

  const createTestMenu = async () => {
    try {
      await createMenu(sampleMenu);
    } catch (error) {
      console.error(error);
    } finally {
      toast.success("New menu created!");
    }
  };

  return (
    <div>
      <Head>
        <title>Menus - LastQR</title>
        <meta name="description" content="Create menus QR using LastQR" />
      </Head>
      <AppLayout>
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between gap-3 border-b border-gray-200 dark:border-gray-800">
            <h1 className="mt-8 mb-4 text-2xl font-medium">Menus</h1>
            <button
              type="button"
              className="flex w-fit items-center gap-x-1.5 rounded-md bg-blue-500 py-2 px-3 text-sm text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700"
              onClick={() => setIsOpen(true)}
            >
              New menu
            </button>
          </div>
          <div className="mt-6">
            <div className="overflow-hidden rounded-lg bg-white drop-shadow dark:bg-gray-800">
              {menus.length > 0 ? (
                <table className="w-full table-auto divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500 dark:text-gray-400"
                      >
                        Dishes
                      </th>
                      <th
                        scope="col"
                        className="py-3 text-right text-xs font-medium uppercase text-gray-500 dark:text-gray-400"
                      ></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {menus?.map((menu: Menu) => (
                      <tr
                        key={menu.id}
                        className="group cursor-pointer bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                        onClick={() => router.push(`/app/editor/${menu.id}`)}
                      >
                        <td className="relative px-6 py-4 align-middle text-sm font-medium text-gray-800 dark:text-gray-200">
                          {menu.name}
                        </td>
                        <td className="whitespace-nowrap px-6 text-right align-middle text-sm text-gray-800 dark:text-gray-200">
                          {getDishCount(menu)}
                        </td>

                        <td className="flex-none whitespace-nowrap pr-4 text-right align-middle">
                          <DropdownMenu.Root>
                            <DropdownMenu.Trigger className="text-gray-500 dark:text-gray-400">
                              <IoEllipsisHorizontal />
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Portal>
                              <DropdownMenu.Content
                                align="end"
                                sideOffset={5}
                                className={clsx(
                                  "radix-side-top:animate-slide-up radix-side-bottom:animate-slide-down",
                                  "w-48 rounded-lg border border-gray-200 px-1.5 py-1 shadow-md dark:border-gray-700 md:w-56",
                                  "bg-white dark:bg-gray-800"
                                )}
                              >
                                <DropdownMenu.Item
                                  className={clsx(
                                    "flex w-full cursor-pointer select-none items-center rounded-md px-2 py-2 text-xs outline-none",
                                    "text-gray-700 focus:bg-gray-50 dark:text-gray-300 dark:focus:bg-gray-900"
                                  )}
                                  onClick={() =>
                                    router.push(`/app/editor/${menu.id}`)
                                  }
                                >
                                  <HiPencil className="h-3 w-3" />
                                  <span className="ml-1.5">Edit</span>
                                </DropdownMenu.Item>
                                <DropdownMenu.Item
                                  className={clsx(
                                    "flex w-full cursor-pointer select-none items-center rounded-md px-2 py-2 text-xs outline-none",
                                    "text-gray-700 focus:bg-gray-50 dark:text-gray-300 dark:focus:bg-gray-900"
                                  )}
                                >
                                  <IoDuplicate className="h-3 w-3" />
                                  <span className="ml-1.5">Duplicate</span>
                                </DropdownMenu.Item>
                                <DropdownMenu.Item
                                  className={clsx(
                                    "flex w-full cursor-pointer select-none items-center rounded-md px-2 py-2 text-xs outline-none",
                                    "!font-bold text-red-500 focus:bg-gray-50 dark:text-red-600 dark:focus:bg-gray-900"
                                  )}
                                  onClick={() => deleteMenu(menu.id)}
                                >
                                  <IoTrash className="h-3 w-3" />
                                  <span className="ml-1.5">Remove</span>
                                </DropdownMenu.Item>
                              </DropdownMenu.Content>
                            </DropdownMenu.Portal>
                          </DropdownMenu.Root>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center gap-6 py-12 px-4">
                  <Image
                    src="/no-menu.svg"
                    alt="No menu"
                    aria-hidden="true"
                    width={445}
                    height={366.06}
                  />
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-800 dark:text-white">
                      No menus... yet!
                    </div>
                    <div className="mt-1 text-sm text-gray-800 dark:text-gray-300">
                      Create a new menu to liven the place up a little
                    </div>
                  </div>
                  <button
                    type="button"
                    className="flex w-fit items-center gap-x-1.5 rounded-md bg-blue-500 py-2 px-3 text-sm text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700"
                    onClick={() => setIsOpen(true)}
                  >
                    New menu
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </AppLayout>
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
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
                Create new menu
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-sm font-normal text-gray-700 dark:text-gray-400">
                You may start from scratch or use our test menu.
              </Dialog.Description>
              <div className="mt-2 flex flex-col items-start gap-2 overflow-y-auto px-1 py-4">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="flex w-full gap-2 rounded-md border border-transparent px-5 py-4 text-left ring-2 ring-blue-500 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700"
                    onClick={createNewMenu}
                  >
                    <div className="space-y-1">
                      <div className="text-sm font-medium">
                        Start from scratch
                      </div>
                      <div className="text-sm font-normal text-gray-800 dark:text-gray-300">
                        Select this option if you have experience making digital
                        menus online.
                      </div>
                    </div>
                  </button>
                </Dialog.Close>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="flex w-full gap-2 rounded-md border border-gray-200 px-5 py-4 text-left hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700"
                    onClick={createTestMenu}
                  >
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Use test menu</div>
                      <div className="text-sm font-normal text-gray-800 dark:text-gray-300">
                        The best way to learn is through examples. We will
                        create a menu with categories, dishes, photos, prices,
                        etc... You can delete it whenever you want.
                      </div>
                    </div>
                  </button>
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

export default MenusPage;
