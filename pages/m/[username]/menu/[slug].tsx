import { useState, useEffect, useRef, Fragment } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import type { Menu, MenuItem, Shop } from "../../../../lib/types";
import { supabase } from "../../../../lib/supabaseClient";
import clsx from "clsx";
import { IoArrowBackOutline, IoImageOutline } from "react-icons/io5";
import { useRouter } from "next/router";
import { useDraggable } from "react-use-draggable-scroll";
import { Transition } from "@headlessui/react";
import * as Dialog from "@radix-ui/react-dialog";
import { getBasePrice } from "../../../../lib/getBasePrice";
import { Footer } from "../../../../components/Footer";
import Image from "next/image";

type PageProps = {
  menu: Menu;
  shop: Shop;
};

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  query,
}) => {
  try {
    const username = query.username;
    const slug = query.slug;

    const { data: shopData, error: shopHasError } = await supabase
      .from("shops")
      .select()
      .match({
        username: username,
      })
      .single();

    if (shopHasError) {
      return {
        notFound: true,
      };
    }

    const shop: Shop = shopData;

    const { data: menuData, error: menuHasError } = await supabase
      .from("menus")
      .select()
      .match({
        slug: slug,
        shop_id: shop.id,
      })
      .single();

    if (menuHasError) {
      return {
        notFound: true,
      };
    }

    const menu: Menu = menuData;

    const props: PageProps = {
      shop,
      menu,
    };

    return {
      props: props,
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

const MenuPreview = ({
  shop,
  menu,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  const [activeCollectionIndex, setActiveCollectionIndex] = useState<number>(0);
  const [isDishModalOpen, setIsDishModalOpen] = useState<boolean>(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(
    null
  );

  const scrollRef =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
  const { events: scrollEvents } = useDraggable(scrollRef);

  const handleViewDish = (menuItem: MenuItem) => {
    setSelectedMenuItem(menuItem);
    setIsDishModalOpen(true);
  };

  useEffect(() => {
    const initialCollectionIndex = Number(router.asPath.split("#")[1]);
    setActiveCollectionIndex(initialCollectionIndex);
  }, [router.asPath]);

  return (
    <>
      <div className="bg-gray-900 dark:bg-black ">
        <Transition
          appear={true}
          show={true}
          enter="transition-opacity duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="mx-auto flex h-screen max-w-md flex-col bg-gray-100 dark:bg-gray-900 dark:text-white">
            <header
              className="z-10 flex w-full flex-col border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
              aria-label="Global"
            >
              <div className="mx-4 flex flex-wrap items-start gap-2 pt-4 sm:flex-nowrap">
                <Link href={`/m/${shop.username}`}>
                  <a className="flex-none rounded-md p-2 text-sm hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                    <IoArrowBackOutline className="h-4 w-4" />
                  </a>
                </Link>
                <div className="text-lg font-semibold text-gray-800 dark:text-white">
                  {menu.name}
                </div>
              </div>

              <div
                className="scrollbar-hide my-1 flex gap-2 overflow-x-auto overscroll-x-contain whitespace-nowrap p-1 px-4"
                {...scrollEvents}
                ref={scrollRef}
              >
                {menu.collections.map((collection, index) => (
                  <a
                    href={`#${index}`}
                    tabIndex={1}
                    className={clsx(
                      "rounded-full border border-gray-300 px-4 py-2 text-sm font-medium outline-none dark:border-gray-600",
                      "hover:bg-gray-200  focus:bg-gray-200 dark:hover:bg-gray-700 dark:focus:bg-gray-700",
                      activeCollectionIndex === index &&
                        "bg-gray-900 text-white hover:text-gray-900 dark:hover:text-white"
                    )}
                    key={collection.id}
                    onClick={() => setActiveCollectionIndex(index)}
                  >
                    {collection.name}
                  </a>
                ))}
              </div>
            </header>
            <div className="scrollbar-hide flex-1 overflow-y-auto scroll-smooth pb-20">
              <div className="mx-auto px-4">
                <div className="space-y-3">
                  {menu.collections &&
                    menu.collections.map((collection, index) => {
                      return (
                        <div
                          key={collection.id}
                          id={String(index)}
                          className="rounded-lg"
                        >
                          <div>
                            <div className="relative my-4 inline-flex w-full items-center justify-between gap-3 px-4 focus:outline-none">
                              <div className="flex items-baseline gap-3">
                                <div className="flex-shrink font-medium">
                                  <span>{collection.name}</span>
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {collection.items.length} dishes
                                </div>
                              </div>
                              <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
                            </div>
                          </div>
                          <div>
                            {collection.description && (
                              <div className="mb-3 px-4 text-sm text-gray-800 dark:text-gray-200">
                                {collection.description}
                              </div>
                            )}
                            <div className="divide-y divide-gray-200 rounded-lg dark:divide-gray-700">
                              {collection.items &&
                                collection.items?.map((item) => {
                                  return (
                                    <div
                                      className={clsx(
                                        "group/item",
                                        "relative flex cursor-pointer items-start gap-4 py-4 px-2",
                                        "border-x border-gray-200 bg-white hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700",
                                        "first:rounded-t-lg first:border-t",
                                        "last:rounded-b-lg last:border-b"
                                      )}
                                      key={item.id}
                                      onClick={() => handleViewDish(item)}
                                      tabIndex={1}
                                    >
                                      {/* title & description & price */}
                                      <div className="ml-2 flex-1 text-gray-500 dark:text-gray-400">
                                        <div className="text-base font-medium text-gray-900 line-clamp-2 dark:text-white">
                                          {item.name}
                                        </div>
                                        {item.description && (
                                          <div className="mt-1 text-sm line-clamp-2">
                                            {item.description}
                                          </div>
                                        )}
                                        <div className="mt-2 flex flex-wrap gap-x-2 gap-y-0.5 text-sm line-clamp-2 dark:text-gray-100">
                                          {item.variants.map((variant) => (
                                            <span
                                              key={variant.id}
                                              className="group/variant space-x-2"
                                            >
                                              {variant.name && (
                                                <span>{variant.name}:</span>
                                              )}
                                              <span className="text-right">
                                                {variant.price?.toFixed(2)}
                                              </span>
                                              <span className="group-last/variant:hidden pr-2">
                                                /
                                              </span>
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                      <div className="group-hover/item:dark:bg-gray-600 flex h-16 w-16 flex-none items-center justify-center rounded-md bg-gray-200 dark:bg-gray-700">
                                        {item.image_url ? (
                                          <Image
                                            src={item.image_url}
                                            alt={item.image_url}
                                            className="rounded-md object-cover"
                                            height={64}
                                            width={64}
                                          />
                                        ) : (
                                          <IoImageOutline className="text-gray-600 dark:text-gray-400" />
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </Transition>
        <Footer />
      </div>
      {/* TODO: Full screen dialog */}
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
                "fixed z-50 outline-none",
                "h-screen w-screen max-w-md",
                "top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]",
                "bg-white dark:bg-gray-900"
              )}
            >
              <div className="relative h-60">
                <Image
                  src={
                    selectedMenuItem?.image_url ??
                    "https://grjhlubfwzwxwsmeegoo.supabase.co/storage/v1/object/public/media/covers/placeholder.jpg"
                  }
                  alt={selectedMenuItem?.name}
                  className="object-cover"
                  layout="fill"
                />
              </div>
              {selectedMenuItem && (
                <div className="mx-6 mt-8 space-y-5">
                  <div className="flex items-center justify-between gap-2">
                    <h1 className="text-3xl font-medium dark:text-white">
                      {selectedMenuItem.name}
                    </h1>
                    <div className="flex-none text-right">
                      <p className="text-2xl font-semibold">
                        {getBasePrice(selectedMenuItem)}
                      </p>
                      <small className="text-xs text-gray-700 dark:text-gray-400">
                        Base price
                      </small>
                    </div>
                  </div>
                  {selectedMenuItem.variants.length > 1 && (
                    <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-lg dark:text-gray-100">
                      {selectedMenuItem.variants.map((variant) => (
                        <span key={variant.id} className="group space-x-2">
                          {variant.name && <span>{variant.name}:</span>}
                          <span className="text-right">
                            {variant.price?.toFixed(2)}
                          </span>
                          <span className="group-last:hidden">/</span>
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="whitespace-pre-wrap text-lg dark:text-gray-300">
                    {selectedMenuItem.description}
                  </p>
                </div>
              )}

              <Dialog.Close
                className={clsx(
                  "absolute top-4 left-4 inline-flex items-center justify-center rounded-full p-2",
                  "ring-blue-600 ring-opacity-75 hover:drop-shadow-lg focus:outline-none focus-visible:ring dark:ring-blue-500",
                  "bg-white text-gray-900 dark:bg-gray-800 dark:text-white"
                )}
              >
                <IoArrowBackOutline className="h-6 w-6" />
              </Dialog.Close>
            </Dialog.Content>
          </Transition.Child>
        </Transition.Root>
      </Dialog.Root>
    </>
  );
};

export default MenuPreview;
