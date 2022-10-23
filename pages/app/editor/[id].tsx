import { useEffect, useState, Fragment, useCallback } from "react";
import Link from "next/link";
import {
  IoAddOutline,
  IoArrowBackOutline,
  IoArrowDownOutline,
  IoArrowUpOutline,
  IoDuplicate,
  IoEllipsisVertical,
  IoImageOutline,
  IoTrash,
} from "react-icons/io5";
import { GoArrowUp, GoArrowDown } from "react-icons/go";
import { HiOutlineExternalLink, HiPencil } from "react-icons/hi";
import { useAuth } from "../../../context/authContext";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useShop } from "../../../context/shopContext";
import LoadingSkeleton from "../../../components/LoadingSkeleton";
import {
  Menu,
  MenuCollection,
  MenuItem,
  MenuItemVariant,
} from "../../../lib/types";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Accordion from "@radix-ui/react-accordion";
import { IoClose } from "react-icons/io5";
import { Transition } from "@headlessui/react";
import clsx from "clsx";
import { nanoid } from "nanoid";
import { supabase } from "../../../lib/supabaseClient";
import MenuItemImage from "../../../components/MenuItemImage";
import { getBasePrice } from "../../../lib/getBasePrice";
import Image from "next/image";
import toast from "react-hot-toast";

const EditorPage: NextPage = () => {
  const { session, loading: loadingAuth } = useAuth();
  const {
    shop,
    setCurrentShopId,
    updateMenu,
    updateMenuItem,
    removeMenuItem,
    addMenuItem,
    removeCollection,
    moveUpCollection,
    moveDownCollection,
    moveUpMenuItem,
    moveDownMenuItem,
  } = useShop();

  const defaultVariant = {
    id: `var_${nanoid()}`,
    name: null,
    price: null,
  };

  const [isSaving, setIsSaving] = useState<boolean | null>(null);

  const [currentMenu, setCurrentMenu] = useState<Menu>({} as Menu);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState<boolean>(false);
  const [isDishModalOpen, setIsDishModalOpen] = useState<boolean>(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] =
    useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [singlePriceMode, setSinglePriceMode] = useState<boolean>(true);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem>(
    {} as MenuItem
  );

  const [menuItemName, setMenuItemName] =
    useState<MenuItem["name"]>("Untitled dish");
  const [menuItemDescription, setMenuItemDescription] =
    useState<MenuItem["description"]>(null);
  const [menuItemVariants, setMenuItemVariants] = useState<MenuItemVariant[]>([
    defaultVariant,
  ]);

  const [menuName, setMenuName] = useState<Menu["name"]>("");
  const [selectedMenuCollection, setSelectedMenuCollection] =
    useState<MenuCollection>({} as MenuCollection);
  const [menuCollectionName, setMenuCollectionName] = useState<
    MenuCollection["name"]
  >("Untitled collection");
  const [menuCollectionDescription, setMenuCollectionDescription] =
    useState<MenuCollection["description"]>("");

  const router = useRouter();
  const { id } = router.query;

  const setCurrentShopIdCallback = useCallback(
    (shopId: string) => {
      setCurrentShopId(shopId);
    },
    [setCurrentShopId]
  );

  const getMenu = useCallback(async () => {
    let { data, error } = await supabase
      .from("menus")
      .select()
      .eq("id", id)
      .single();
    if (error) {
      throw error;
    }
    setCurrentMenu(data);
  }, [id]);

  useEffect(() => {
    if (id) {
      getMenu();
    }
  }, [id, getMenu]);

  const handleMenuItemVariantNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    targetMenuItemVariant: MenuItemVariant
  ) => {
    setMenuItemVariants((prevVariants) =>
      prevVariants.map((variant) => {
        if (variant.id === targetMenuItemVariant.id) {
          Object.defineProperty(variant, "name", { value: e.target.value });
        }
        return variant;
      })
    );
  };

  const handleMenuItemVariantValueChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    targetMenuItemVariant: MenuItemVariant
  ) => {
    if (e.target.value) {
      const priceWithTwoDecimalPoints = parseFloat(e.target.value).toFixed(2);
      const price = parseFloat(priceWithTwoDecimalPoints);
      setMenuItemVariants((prevVariants) =>
        prevVariants.map((variant) => {
          if (variant.id === targetMenuItemVariant.id) {
            Object.defineProperty(variant, "price", { value: price });
          }
          return variant;
        })
      );
    } else {
      setMenuItemVariants((prevVariants) =>
        prevVariants.map((variant) => {
          if (variant.id === targetMenuItemVariant.id) {
            Object.defineProperty(variant, "price", { value: null });
          }
          return variant;
        })
      );
    }
    if (parseFloat(e.target.value) < 0) {
      setMenuItemVariants((prevVariants) =>
        prevVariants.map((variant) => {
          if (variant.id === targetMenuItemVariant.id) {
            Object.defineProperty(variant, "price", { value: null });
          }
          return variant;
        })
      );
    }
  };

  const toggleSinglePriceMode = () => {
    if (singlePriceMode === false) {
      setSinglePriceMode(true);
    } else {
      setMenuItemVariants((prevVariants) => {
        Object.defineProperty(prevVariants[0], "name", { value: null });
        return [prevVariants[0]];
      });
      setSinglePriceMode(false);
    }
  };

  const handleEditMenuNameButton = (menu: Menu) => {
    setMenuName(menu.name);
    setIsMenuModalOpen(true);
    setIsEditing(true);
  };

  const handleEditDishButtonClick = (menuItem: MenuItem) => {
    setSelectedMenuItem(menuItem);
    setMenuItemName(menuItem.name);
    setMenuItemDescription(menuItem.description);
    setMenuItemVariants(
      menuItem.variants ? menuItem.variants : [defaultVariant]
    );
    setSinglePriceMode(menuItem.variants.length < 2);
    setIsDishModalOpen(true);
    setIsEditing(true);
  };

  const handleEditCollectionButtonClick = (menuCollection: MenuCollection) => {
    setSelectedMenuCollection(menuCollection);
    setMenuCollectionName(menuCollection.name);
    setMenuCollectionDescription(
      menuCollection.description ? menuCollection.description : null
    );
    setIsCollectionModalOpen(true);
    setIsEditing(true);
  };

  const resetState = () => {
    setSelectedMenuItem({} as MenuItem);
    setMenuItemName("Untitled dish");
    setMenuItemDescription(null);
    setMenuItemVariants([defaultVariant]);
    setSelectedMenuCollection({} as MenuCollection);
    setMenuCollectionName("Untitled collection");
    setMenuCollectionDescription(null);
    setIsEditing(false);
  };

  const handleNewDishButtonClick = (collection?: MenuCollection) => {
    resetState();
    if (collection) {
      setSelectedMenuCollection(collection);
    }
    setIsDishModalOpen(true);
  };

  const handleNewCollectionButtonClick = () => {
    resetState();
    setIsCollectionModalOpen(true);
  };

  const handleSaveMenuName = async () => {
    try {
      setIsSaving(true);

      const updatedMenu = {
        ...currentMenu,
        name: menuName,
      };

      await updateMenu(updatedMenu);
      await getMenu();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDish = async () => {
    try {
      setIsSaving(true);

      if (menuItemName === "") {
        alert("Dish name cannot be empty");
      } else {
        if (isEditing) {
          const updatedMenuItem: MenuItem = {
            ...selectedMenuItem,
            name: menuItemName,
            description: menuItemDescription,
            variants: menuItemVariants,
          };

          await updateMenuItem(currentMenu, updatedMenuItem);
        } else {
          const newMenuItem: MenuItem = {
            ...selectedMenuItem,
            id: `item_${nanoid()}`,
            name: menuItemName,
            description: menuItemDescription,
            variants: menuItemVariants,
            collection_id: selectedMenuCollection.id,
          };

          await addMenuItem(currentMenu, newMenuItem);
        }
        await getMenu();
        resetState();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateNewCollection = useCallback(async () => {
    try {
      setIsSaving(true);

      const newItemId = `item_${nanoid()}`;
      const newCollectionId = `col_${nanoid()}`;
      const newVariantId = `var_${nanoid()}`;
      const newMenuItem: MenuItem = {
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
      const newMenuCollection: MenuCollection = {
        id: newCollectionId,
        name: "Untitled collection",
        description: "",
        items: [newMenuItem],
      };

      const updatedMenu: Menu = JSON.parse(JSON.stringify(currentMenu));
      updatedMenu.collections.push(newMenuCollection);
      updatedMenu.items.push(newMenuItem);

      await updateMenu(updatedMenu);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  }, [currentMenu, updateMenu]);

  const handleSaveCollection = async () => {
    try {
      setIsSaving(true);

      if (menuCollectionName === "") {
        alert("Collection name cannot be empty");
      } else {
        if (isEditing) {
          const updatedMenu: Menu = JSON.parse(JSON.stringify(currentMenu));
          const collectionIndex = updatedMenu.collections.findIndex(
            (collection) => collection.id === selectedMenuCollection.id
          );
          updatedMenu.collections[collectionIndex] = {
            ...selectedMenuCollection,
            name: menuCollectionName,
            description: menuCollectionDescription,
          };
          await updateMenu(updatedMenu);
        } else {
          await handleCreateNewCollection();
        }
        await getMenu();
        resetState();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveMenuItem = async (targetMenuItem: MenuItem) => {
    try {
      setIsSaving(true);

      await removeMenuItem(currentMenu, targetMenuItem);
      await getMenu();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDuplicateMenuItem = async (currentMenuItem: MenuItem) => {
    try {
      setIsSaving(true);

      const newMenuItem: MenuItem = {
        ...currentMenuItem,
        id: `item_${nanoid()}`,
      };
      await addMenuItem(currentMenu, newMenuItem);
      await getMenu();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveCollection = async (targetCollection: MenuCollection) => {
    try {
      setIsSaving(true);

      await removeCollection(currentMenu, targetCollection);
      await getMenu();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleMoveUpCollection = async (targetCollection: MenuCollection) => {
    try {
      setIsSaving(true);

      await moveUpCollection(currentMenu, targetCollection);
      await getMenu();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleMoveDownCollection = async (targetCollection: MenuCollection) => {
    try {
      setIsSaving(true);

      await moveDownCollection(currentMenu, targetCollection);
      await getMenu();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleMoveUpMenuItem = async (targetItem: MenuItem) => {
    try {
      setIsSaving(true);

      await moveUpMenuItem(currentMenu, targetItem);
      await getMenu();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleMoveDownMenuItem = async (targetItem: MenuItem) => {
    try {
      setIsSaving(true);

      await moveDownMenuItem(currentMenu, targetItem);
      await getMenu();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (isSaving === true) {
      toast.loading("Saving", { id: "saving" });
    } else if (isSaving === false) {
      toast.success("Saved!", { id: "saving" });
    }
  }, [isSaving]);

  useEffect(() => {
    if (currentMenu) {
      const currentLocalStorage = localStorage.getItem("lastqr-app-data");

      let localStorageData;

      if (currentLocalStorage) {
        const currentLocalStorageData = JSON.parse(currentLocalStorage);
        localStorageData = {
          ...currentLocalStorageData,
          menu: {
            id: currentMenu.id,
            shop_id: shop.id,
          },
        };
      } else {
        localStorageData = {
          menu: {
            id: currentMenu.id,
            shop_id: shop.id,
          },
        };
      }
      localStorage.setItem("lastqr-app-data", JSON.stringify(localStorageData));
    }
  }, [currentMenu, shop.id]);

  useEffect(() => {
    const currentLocalStorage = localStorage.getItem("lastqr-app-data");
    if (currentLocalStorage) {
      const localStorageData = JSON.parse(currentLocalStorage);
      if (localStorageData.menu && localStorageData.menu.shop_id) {
        setCurrentShopIdCallback(localStorageData.menu.shop_id);
      }
    }
  }, [setCurrentShopIdCallback]);

  useEffect(() => {
    if (currentMenu.collections?.length === 0) {
      handleCreateNewCollection();
      getMenu();
    }
  }, [currentMenu, getMenu, handleCreateNewCollection]);

  if (!session && !loadingAuth) {
    router.push("/login");
  }

  if (!currentMenu) {
    return (
      <div>
        404 Not Found.{" "}
        <Link href="/app/menus">
          <a className="hover:underline">Back Home</a>
        </Link>
      </div>
    );
  }

  return Object.keys(currentMenu).length === 0 ? (
    <LoadingSkeleton />
  ) : (
    <>
      <div className="flex h-screen flex-col bg-gray-100 dark:bg-gray-900 dark:text-white">
        <header
          className="z-10 flex h-16 w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800"
          aria-label="Global"
        >
          <div className="mx-auto flex w-full flex-wrap items-center justify-between gap-3 px-4 sm:flex-nowrap">
            <Link href="/app/menus">
              <a className="flex-none rounded-md py-2 pl-2 pr-3 text-sm hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                <div className="flex items-center gap-1 drop-shadow-sm">
                  <IoArrowBackOutline className="h-4 w-4" />
                  <div>Dashboard</div>
                </div>
              </a>
            </Link>
            <a
              className={clsx(
                "inline-flex select-none items-center justify-center rounded-md px-4 py-2 font-medium",
                "bg-white text-sm text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 dark:hover:text-white",
                "border dark:border-gray-700",
                "focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75",
                "group"
              )}
              href={`/m/${shop.username}/menu/${currentMenu.slug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Preview Menu</span>
              <HiOutlineExternalLink
                className={clsx(
                  "ml-2 h-4 w-4 shrink-0 text-gray-700 ease-in-out dark:text-gray-400",
                  "dark:group-hover:text-gray-100"
                )}
              />
            </a>
          </div>
        </header>
        <div className="flex-1 overflow-auto pb-20">
          <div className="mx-auto max-w-3xl px-4">
            <button
              type="button"
              onClick={() => handleEditMenuNameButton(currentMenu)}
            >
              <h1 className="mx-4 mt-8 mb-4 text-left text-2xl font-medium hover:underline">
                {currentMenu.name}
              </h1>
            </button>
            <Accordion.Root
              type="multiple"
              defaultValue={currentMenu.collections.map(
                (_collection, index) => `item-${index + 1}`
              )}
              className="space-y-3"
            >
              {currentMenu.collections &&
                currentMenu.collections.map((collection, collectionIndex) => {
                  return (
                    <Accordion.Item
                      key={collection.id}
                      value={`item-${collectionIndex + 1}`}
                      className="rounded-lg"
                    >
                      <Accordion.Header className="group">
                        <div
                          className={clsx(
                            "focus:outline-none",
                            "relative inline-flex w-full items-center justify-between gap-3",
                            "group-radix-state-closed:rounded-lg group-radix-state-closed:border group-radix-state-closed:border-gray-200  group-radix-state-closed:bg-white group-radix-state-closed:p-4 dark:group-radix-state-closed:border-gray-700 dark:group-radix-state-closed:bg-gray-800",
                            "group-radix-state-open:my-4 group-radix-state-open:px-4"
                          )}
                        >
                          <div className={clsx("flex-shrink font-medium")}>
                            <button
                              type="button"
                              onClick={() =>
                                handleEditCollectionButtonClick(collection)
                              }
                            >
                              <span className="hover:underline">
                                {collection.name}
                              </span>
                            </button>
                          </div>
                          <div
                            className={clsx(
                              "text-xs text-gray-500 dark:text-gray-400",
                              "group-radix-state-open:hidden"
                            )}
                          >
                            {collection.items.length} dishes
                          </div>
                          <div
                            className={clsx(
                              "flex-grow border-t border-gray-300 dark:border-gray-700",
                              "group-radix-state-closed:invisible"
                            )}
                          ></div>
                          <div className="flex gap-1">
                            <button
                              type="button"
                              className={clsx(
                                "rounded-full border border-gray-300 p-1.5 dark:border-gray-700",
                                "group-radix-state-open:hover:bg-gray-200 dark:group-radix-state-open:hover:bg-gray-800",
                                "group-radix-state-closed:hover:bg-gray-200 dark:group-radix-state-closed:hover:bg-gray-700",
                                collectionIndex === 0 && "hidden"
                              )}
                              onClick={() => handleMoveUpCollection(collection)}
                              disabled={collectionIndex === 0}
                            >
                              <IoArrowUpOutline />
                            </button>
                            <button
                              type="button"
                              className={clsx(
                                "rounded-full border border-gray-300 p-1.5 dark:border-gray-700",
                                "group-radix-state-open:hover:bg-gray-200 dark:group-radix-state-open:hover:bg-gray-800",
                                "group-radix-state-closed:hover:bg-gray-200 dark:group-radix-state-closed:hover:bg-gray-700",
                                collectionIndex ===
                                  currentMenu.collections.length - 1 && "hidden"
                              )}
                              onClick={() =>
                                handleMoveDownCollection(collection)
                              }
                              disabled={
                                collectionIndex ===
                                currentMenu.collections.length - 1
                              }
                            >
                              <IoArrowDownOutline />
                            </button>
                            <Accordion.Trigger
                              className={clsx(
                                "w-[80px] rounded-full border border-gray-300 px-3.5 text-xs dark:border-gray-700",
                                "group-radix-state-open:hover:bg-gray-200 dark:group-radix-state-open:hover:bg-gray-800",
                                "group-radix-state-closed:hover:bg-gray-200 dark:group-radix-state-closed:hover:bg-gray-700"
                              )}
                            >
                              <span className="group-radix-state-closed:hidden">
                                Collapse
                              </span>
                              <span className="group-radix-state-open:hidden">
                                Expand
                              </span>
                            </Accordion.Trigger>
                            <DropdownMenu.Root>
                              <DropdownMenu.Trigger
                                className={clsx(
                                  "rounded-full border border-gray-300 p-1.5 dark:border-gray-700",
                                  "group-radix-state-open:hover:bg-gray-200 dark:group-radix-state-open:hover:bg-gray-800",
                                  "group-radix-state-closed:hover:bg-gray-200 dark:group-radix-state-closed:hover:bg-gray-700"
                                )}
                              >
                                <IoEllipsisVertical />
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
                                      handleEditCollectionButtonClick(
                                        collection
                                      )
                                    }
                                  >
                                    <HiPencil className="h-3 w-3" />
                                    <span className="ml-1.5">Rename</span>
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
                                    onClick={() =>
                                      handleRemoveCollection(collection)
                                    }
                                  >
                                    <IoTrash className="h-3 w-3" />
                                    <span className="ml-1.5">Remove</span>{" "}
                                  </DropdownMenu.Item>
                                </DropdownMenu.Content>
                              </DropdownMenu.Portal>
                            </DropdownMenu.Root>
                          </div>
                          <div
                            className={clsx(
                              "w-7 border-t border-gray-300 dark:border-gray-700",
                              "group-radix-state-closed:invisible",
                              "hidden sm:block"
                            )}
                          ></div>
                        </div>
                      </Accordion.Header>
                      <Accordion.Content>
                        {collection.description && (
                          <div className="mb-3 px-4 text-sm text-gray-800 dark:text-gray-200">
                            {collection.description}
                          </div>
                        )}
                        <div className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-800">
                          {collection.items &&
                            collection.items?.map((item, itemIndex) => {
                              return (
                                <Transition
                                  key={item.id}
                                  show={true}
                                  appear={true}
                                  enter="transition-all duration-500 ease-out"
                                  enterFrom="opacity-0 scale-95"
                                  enterTo="opacity-100 scale-100"
                                  leave="transition-all duration-500 ease-in"
                                  leaveFrom="opacity-100 scale-100"
                                  leaveTo="opacity-0 scale-95"
                                >
                                  <div className="group relative flex items-center gap-4 p-2">
                                    {/* title & description */}
                                    <div className="ml-2 flex-1 truncate text-gray-500 dark:text-gray-400">
                                      <span className="text-sm text-gray-900 dark:text-white">
                                        {item.name}
                                      </span>
                                      {item.description && (
                                        <span className="text-sm">
                                          {" "}
                                          - {item.description}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex gap-1.5">
                                      <button
                                        type="button"
                                        className={clsx(
                                          "h-10 w-10 rounded-md border border-gray-300 px-0.5 dark:border-gray-700",
                                          "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600",
                                          "hidden items-center justify-center group-hover:flex",
                                          itemIndex === 0 && "!hidden"
                                        )}
                                        onClick={() =>
                                          handleMoveUpMenuItem(item)
                                        }
                                        disabled={itemIndex === 0}
                                      >
                                        <GoArrowUp className="h-5 w-5" />
                                      </button>
                                      <button
                                        type="button"
                                        className={clsx(
                                          "h-10 w-10 rounded-md border border-gray-300 px-0.5 dark:border-gray-700",
                                          "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600",
                                          "hidden items-center justify-center group-hover:flex",
                                          itemIndex ===
                                            collection.items.length - 1 &&
                                            "!hidden"
                                        )}
                                        onClick={() =>
                                          handleMoveDownMenuItem(item)
                                        }
                                        disabled={
                                          itemIndex ===
                                          collection.items.length - 1
                                        }
                                      >
                                        <GoArrowDown className="h-5 w-5" />
                                      </button>
                                      <button
                                        type="button"
                                        className={clsx(
                                          "h-10 rounded-md border border-gray-300 px-3 text-sm font-medium dark:border-gray-700",
                                          "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600",
                                          "hidden items-center justify-center group-hover:flex"
                                        )}
                                        onClick={() =>
                                          handleEditDishButtonClick(item)
                                        }
                                      >
                                        Edit
                                      </button>
                                    </div>
                                    {/* price */}
                                    <div className="text-sm group-hover:hidden">
                                      {getBasePrice(item)}
                                    </div>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-200 group-hover:hidden dark:bg-gray-700">
                                      {item.image_url ? (
                                        <Image
                                          src={item.image_url}
                                          alt={item.name}
                                          className="h-10 w-10 rounded-md object-cover"
                                          height={40}
                                          width={40}
                                        />
                                      ) : (
                                        <IoImageOutline className="text-gray-600 dark:text-gray-400" />
                                      )}
                                    </div>
                                    <div className="relative inline-block text-left">
                                      <DropdownMenu.Root>
                                        <DropdownMenu.Trigger className="h-10 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                                          <IoEllipsisVertical />
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
                                                handleEditDishButtonClick(item)
                                              }
                                            >
                                              <HiPencil className="h-3 w-3" />
                                              <span className="ml-1.5">
                                                Edit
                                              </span>
                                            </DropdownMenu.Item>
                                            <DropdownMenu.Item
                                              className={clsx(
                                                "flex w-full cursor-pointer select-none items-center rounded-md px-2 py-2 text-xs outline-none",
                                                "text-gray-700 focus:bg-gray-50 dark:text-gray-300 dark:focus:bg-gray-900"
                                              )}
                                              onClick={() =>
                                                handleDuplicateMenuItem(item)
                                              }
                                            >
                                              <IoDuplicate className="h-3 w-3" />
                                              <span className="ml-1.5">
                                                Duplicate
                                              </span>
                                            </DropdownMenu.Item>
                                            <DropdownMenu.Item
                                              className={clsx(
                                                "flex w-full cursor-pointer select-none items-center  rounded-md px-2 py-2 text-xs outline-none",
                                                "text-gray-700 focus:bg-gray-50 dark:text-gray-300 dark:focus:bg-gray-900",
                                                itemIndex === 0 && "!hidden"
                                              )}
                                              onClick={() =>
                                                handleMoveUpMenuItem(item)
                                              }
                                              disabled={itemIndex === 0}
                                            >
                                              <GoArrowUp className="h-3 w-3" />
                                              <span className="ml-1.5">
                                                Move up
                                              </span>
                                            </DropdownMenu.Item>
                                            <DropdownMenu.Item
                                              className={clsx(
                                                "flex w-full cursor-pointer select-none items-center rounded-md px-2 py-2 text-xs outline-none",
                                                "text-gray-700 focus:bg-gray-50 dark:text-gray-300 dark:focus:bg-gray-900",
                                                itemIndex ===
                                                  collection.items.length - 1 &&
                                                  "!hidden"
                                              )}
                                              onClick={() =>
                                                handleMoveDownMenuItem(item)
                                              }
                                              disabled={
                                                itemIndex ===
                                                collection.items.length - 1
                                              }
                                            >
                                              <GoArrowDown className="h-3 w-3" />
                                              <span className="ml-1.5">
                                                Move down
                                              </span>
                                            </DropdownMenu.Item>
                                            <DropdownMenu.Item
                                              className={clsx(
                                                "flex w-full cursor-pointer select-none items-center rounded-md px-2 py-2 text-xs outline-none",
                                                "!font-bold text-red-500 focus:bg-gray-50 dark:text-red-600 dark:focus:bg-gray-900"
                                              )}
                                              onClick={() =>
                                                handleRemoveMenuItem(item)
                                              }
                                            >
                                              <IoTrash className="h-3 w-3" />
                                              <span className="ml-1.5">
                                                Remove
                                              </span>
                                            </DropdownMenu.Item>
                                          </DropdownMenu.Content>
                                        </DropdownMenu.Portal>
                                      </DropdownMenu.Root>
                                    </div>
                                  </div>
                                </Transition>
                              );
                            })}
                          <div className="flex flex-wrap items-center p-1">
                            <button
                              type="button"
                              className={clsx(
                                "flex cursor-pointer select-none items-center rounded-md px-3 py-2 text-xs outline-none",
                                "font-medium text-gray-700 focus:bg-gray-50 dark:text-gray-300 dark:focus:bg-gray-900",
                                "hover:bg-gray-100 hover:text-gray-900 hover:dark:bg-gray-700 dark:hover:text-gray-100"
                              )}
                              onClick={() =>
                                handleNewDishButtonClick(collection)
                              }
                            >
                              <IoAddOutline className="-ml-1 mr-2 h-3.5 w-3.5" />
                              New dish
                            </button>
                            <button
                              type="button"
                              className={clsx(
                                "flex cursor-pointer select-none items-center rounded-md px-3 py-2 text-xs outline-none",
                                "font-medium text-gray-700 focus:bg-gray-50 dark:text-gray-300 dark:focus:bg-gray-900",
                                "hover:bg-gray-100 hover:text-gray-900 hover:dark:bg-gray-700 dark:hover:text-gray-100"
                              )}
                              onClick={() => handleNewCollectionButtonClick()}
                            >
                              <IoAddOutline className="-ml-1 mr-2 h-3.5 w-3.5" />
                              New collection
                            </button>
                          </div>
                        </div>
                      </Accordion.Content>
                    </Accordion.Item>
                  );
                })}
            </Accordion.Root>
          </div>
        </div>
      </div>
      <Dialog.Root open={isMenuModalOpen} onOpenChange={setIsMenuModalOpen}>
        <Transition.Root show={isMenuModalOpen}>
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
                "w-[95vw] max-w-2xl rounded-lg p-4 md:w-full",
                "top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]",
                "bg-white dark:bg-gray-800",
                "focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75"
              )}
            >
              <Dialog.Title className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Edit menu name
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-sm font-normal text-gray-700 dark:text-gray-400">
                Make changes to your menu here. Click save when you&apos;re
                done.
              </Dialog.Description>
              <form
                className="mt-2 space-y-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveMenuName();
                  setIsMenuModalOpen(false);
                }}
              >
                <fieldset>
                  <label
                    htmlFor="menuName"
                    className="text-xs font-medium text-gray-700 dark:text-gray-400"
                  >
                    Menu name
                  </label>
                  <input
                    id="menuName"
                    type="text"
                    placeholder="Menu name"
                    className={clsx(
                      "mt-1 block w-full rounded-md",
                      "text-sm text-gray-700 placeholder:text-gray-500 dark:text-gray-400 dark:placeholder:text-gray-600",
                      "border border-gray-400 focus-visible:border-transparent dark:border-gray-700 dark:bg-gray-800",
                      "focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75"
                    )}
                    value={menuName}
                    onChange={(e) => setMenuName(e.target.value)}
                  />
                </fieldset>
              </form>

              <div className="mt-4 flex justify-end">
                <Dialog.Close
                  className={clsx(
                    "inline-flex select-none justify-center rounded-md px-4 py-2 text-sm font-medium",
                    "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:text-gray-100 dark:hover:bg-blue-600",
                    "border border-transparent",
                    "focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75"
                  )}
                  onClick={() => handleSaveMenuName()}
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
      <Dialog.Root open={isDishModalOpen} onOpenChange={setIsDishModalOpen}>
        <Transition.Root show={isDishModalOpen}>
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
                "w-[95vw] max-w-2xl rounded-lg p-4 md:w-full",
                "top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]",
                "bg-white dark:bg-gray-800",
                "focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75"
              )}
            >
              <Dialog.Title className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {isEditing ? "Edit dish" : "New dish"}
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-sm font-normal text-gray-700 dark:text-gray-400">
                Make changes to your menu here. Click save when you&apos;re
                done.
              </Dialog.Description>
              <form
                className="mt-2 space-y-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveDish();
                  setIsDishModalOpen(false);
                }}
              >
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="flex flex-1 flex-col gap-2">
                    <fieldset>
                      <label
                        htmlFor="menuItemName"
                        className="text-xs font-medium text-gray-700 dark:text-gray-400"
                      >
                        Dish name
                      </label>
                      <input
                        id="menuItemName"
                        type="text"
                        placeholder="French Onion Soup"
                        className={clsx(
                          "mt-1 block w-full rounded-md",
                          "text-sm text-gray-700 placeholder:text-gray-500 dark:text-gray-400 dark:placeholder:text-gray-600",
                          "border border-gray-400 focus-visible:border-transparent dark:border-gray-700 dark:bg-gray-800",
                          "focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75"
                        )}
                        value={menuItemName}
                        onChange={(e) => setMenuItemName(e.target.value)}
                        required
                      />
                    </fieldset>
                    <fieldset>
                      <label
                        htmlFor="menuItemDescription"
                        className="text-xs font-medium text-gray-700 dark:text-gray-400"
                      >
                        Description
                      </label>
                      <textarea
                        id="menuItemDescription"
                        rows={8}
                        placeholder="Delicious onion broth topped with a crusty baguette and gruyère cheese"
                        className={clsx(
                          "mt-1 block w-full rounded-md",
                          "text-sm text-gray-700 placeholder:text-gray-500 dark:text-gray-400 dark:placeholder:text-gray-600",
                          "border border-gray-400 focus-visible:border-transparent dark:border-gray-700 dark:bg-gray-800",
                          "focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75"
                        )}
                        value={menuItemDescription ?? ""}
                        onChange={(e) => setMenuItemDescription(e.target.value)}
                      />
                    </fieldset>
                    <fieldset>
                      <div className="flex justify-between gap-2">
                        <label
                          htmlFor="menuItemPrice"
                          className="text-xs font-medium text-gray-700 dark:text-gray-400"
                        >
                          Price
                        </label>
                        <button
                          type="button"
                          className="text-xs font-medium text-blue-700 dark:text-blue-400 dark:hover:text-blue-500"
                          onClick={toggleSinglePriceMode}
                        >
                          {singlePriceMode
                            ? "Add variants"
                            : "Change to single price"}
                        </button>
                      </div>
                      {singlePriceMode ? (
                        <input
                          id="menuItemPrice"
                          type="number"
                          step={0.01}
                          placeholder="6.50"
                          className={clsx(
                            "mt-1 block w-full rounded-md",
                            "text-sm text-gray-700 placeholder:text-gray-500 dark:text-gray-400 dark:placeholder:text-gray-600",
                            "border border-gray-400 focus-visible:border-transparent dark:border-gray-700 dark:bg-gray-800",
                            "focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75"
                          )}
                          value={menuItemVariants[0].price ?? ""}
                          onChange={(e) =>
                            handleMenuItemVariantValueChange(
                              e,
                              menuItemVariants[0]
                            )
                          }
                          required
                        />
                      ) : (
                        <div>
                          {menuItemVariants &&
                            menuItemVariants.map((variant) => (
                              <div className="flex gap-2" key={variant.id}>
                                <input
                                  id="menuItemVariantName"
                                  type="text"
                                  placeholder="Medium"
                                  className={clsx(
                                    "mt-1 block w-full rounded-md",
                                    "text-sm text-gray-700 placeholder:text-gray-500 dark:text-gray-400 dark:placeholder:text-gray-600",
                                    "border border-gray-400 focus-visible:border-transparent dark:border-gray-700 dark:bg-gray-800",
                                    "focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75"
                                  )}
                                  value={variant.name ?? ""}
                                  onChange={(e) =>
                                    handleMenuItemVariantNameChange(e, variant)
                                  }
                                />
                                <input
                                  id="menuItemVariantValue"
                                  type="number"
                                  step={0.01}
                                  placeholder="10.00"
                                  className={clsx(
                                    "mt-1 block w-full rounded-md",
                                    "text-sm text-gray-700 placeholder:text-gray-500 dark:text-gray-400 dark:placeholder:text-gray-600",
                                    "border border-gray-400 focus-visible:border-transparent dark:border-gray-700 dark:bg-gray-800",
                                    "focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75"
                                  )}
                                  value={variant.price ?? ""}
                                  onChange={(e) =>
                                    handleMenuItemVariantValueChange(e, variant)
                                  }
                                />
                              </div>
                            ))}
                          <div className="mt-2">
                            <button
                              type="button"
                              className="text-xs font-medium text-blue-700 dark:text-blue-400 dark:hover:text-blue-500"
                              onClick={() =>
                                setMenuItemVariants((prevVariants) => [
                                  ...prevVariants,
                                  defaultVariant,
                                ])
                              }
                            >
                              Add variant
                            </button>
                          </div>
                        </div>
                      )}
                    </fieldset>
                  </div>
                  <div className="flex-none">
                    <MenuItemImage
                      url={selectedMenuItem.image_url}
                      onUpload={async (url) => {
                        setSelectedMenuItem((prevMenuItem) => ({
                          ...prevMenuItem,
                          image_url: url,
                        }));
                      }}
                    />
                  </div>
                </div>
              </form>

              <div className="mt-4 flex justify-end">
                <Dialog.Close
                  className={clsx(
                    "inline-flex select-none justify-center rounded-md px-4 py-2 text-sm font-medium",
                    "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:text-gray-100 dark:hover:bg-blue-600",
                    "border border-transparent",
                    "focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75"
                  )}
                  onClick={() => handleSaveDish()}
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
      <Dialog.Root
        open={isCollectionModalOpen}
        onOpenChange={setIsCollectionModalOpen}
      >
        <Transition.Root show={isCollectionModalOpen}>
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
                "w-[95vw] max-w-2xl rounded-lg p-4 md:w-full",
                "top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]",
                "bg-white dark:bg-gray-800",
                "focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75"
              )}
            >
              <Dialog.Title className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {isEditing ? "Edit collection" : "New collection"}
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-sm font-normal text-gray-700 dark:text-gray-400">
                Make changes to your collection here. Click save when
                you&apos;re done.
              </Dialog.Description>
              <form
                className="mt-2 space-y-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveCollection();
                  setIsDishModalOpen(false);
                }}
              >
                <fieldset>
                  <label
                    htmlFor="menuItemName"
                    className="text-xs font-medium text-gray-700 dark:text-gray-400"
                  >
                    Collection name
                  </label>
                  <input
                    id="menuCollectionName"
                    type="text"
                    placeholder="Appetizers, Salads, Main Dish..."
                    className={clsx(
                      "mt-1 block w-full rounded-md",
                      "text-sm text-gray-700 placeholder:text-gray-500 dark:text-gray-400 dark:placeholder:text-gray-600",
                      "border border-gray-400 focus-visible:border-transparent dark:border-gray-700 dark:bg-gray-800",
                      "focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75"
                    )}
                    value={menuCollectionName}
                    onChange={(e) => setMenuCollectionName(e.target.value)}
                    required
                  />
                </fieldset>
                <fieldset>
                  <label
                    htmlFor="menuCollectionDescription"
                    className="text-xs font-medium text-gray-700 dark:text-gray-400"
                  >
                    Description
                  </label>
                  <input
                    id="menuCollectionDescription"
                    type="text"
                    placeholder="Available as a side or as a main dish"
                    className={clsx(
                      "mt-1 block w-full rounded-md",
                      "text-sm text-gray-700 placeholder:text-gray-500 dark:text-gray-400 dark:placeholder:text-gray-600",
                      "border border-gray-400 focus-visible:border-transparent dark:border-gray-700 dark:bg-gray-800",
                      "focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75"
                    )}
                    value={menuCollectionDescription ?? ""}
                    onChange={(e) =>
                      setMenuCollectionDescription(e.target.value)
                    }
                  />
                </fieldset>
              </form>

              <div className="mt-4 flex justify-end">
                <Dialog.Close
                  className={clsx(
                    "inline-flex select-none justify-center rounded-md px-4 py-2 text-sm font-medium",
                    "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:text-gray-100 dark:hover:bg-blue-600",
                    "border border-transparent",
                    "focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75"
                  )}
                  onClick={() => handleSaveCollection()}
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
    </>
  );
};

export default EditorPage;
