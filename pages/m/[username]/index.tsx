import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import type { Menu, Shop } from "../../../lib/types";
import { supabase } from "../../../lib/supabaseClient";
import {
  IoCallSharp,
  IoChevronForwardOutline,
  IoLocationSharp,
} from "react-icons/io5";
import Image from "next/image";

type PageProps = {
  menus: Menu[];
  shop: Shop;
};

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  query,
}) => {
  try {
    const username = query.username;

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

    const { data: menusData, error: menuHasError } = await supabase
      .from("menus")
      .select()
      .match({
        shop_id: shop.id,
      });

    if (menuHasError) {
      return {
        notFound: true,
      };
    }

    const menus: Menu[] = menusData;

    const props: PageProps = {
      shop,
      menus,
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
  menus,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div className="bg-gray-900 dark:bg-black">
      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-white dark:bg-gray-900 dark:text-white">
        <div className="relative h-60">
          <Image
            src={
              shop.cover_image
                ? String(shop.cover_image)
                : "https://grjhlubfwzwxwsmeegoo.supabase.co/storage/v1/object/public/media/covers/placeholder.jpg"
            }
            alt={shop.name}
            className="object-cover"
            layout="fill"
            priority
          />
        </div>
        <div className="scrollbar-hide flex-1 overflow-y-auto scroll-smooth pb-20">
          <div className="mx-auto max-w-3xl px-4">
            <h1 className="mx-4 mt-8 text-2xl font-medium">{shop.name}</h1>
            {shop.address && (
              <div className="mx-4 mt-2 flex items-start gap-4 text-gray-500 dark:text-gray-400">
                <IoLocationSharp className="my-1 h-4 w-4 flex-none" />
                <span className="text-sm font-medium">{shop.address}</span>
              </div>
            )}
            {shop.phone_number && (
              <div className="mx-4 mt-2 flex items-start gap-4 text-gray-500 dark:text-gray-400">
                <IoCallSharp className="my-0.5 h-4 w-4 flex-none" />
                <span className="text-sm font-medium">{shop.phone_number}</span>
              </div>
            )}
            <div className="mt-8 space-y-2">
              {menus.map((menu) => {
                return (
                  <Link
                    key={menu.id}
                    href={`/m/${shop.username}/menu/${menu.slug}`}
                  >
                    <a className="group relative flex w-full items-center gap-4 rounded-lg border  border-gray-200 bg-gray-100 px-2 py-4 text-left hover:bg-gray-200 dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                      <div className="mx-2 flex flex-1 items-center gap-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20px"
                          height="20px"
                          className="fill-gray-900 dark:fill-white"
                        >
                          <path d="M16.563 4.61v12.187a.627.627 0 01-.235.5.587.587 0 01-.469.203c-.203 0-.382-.059-.5-.203-.144-.117-.203-.297-.203-.5v-3.985H13.72c-.262 0-.496-.03-.73-.117-.235-.117-.442-.234-.614-.41-.18-.176-.297-.41-.414-.613a2.188 2.188 0 01-.117-.735l.031-3.34c-.031-1.081.32-2.136.906-3.019a5.437 5.437 0 012.492-1.992c.086-.055.204-.055.352-.086.234 0 .469.117.645.293.175.176.293.41.293.644zm-1.407-.383a4.13 4.13 0 00-1.406 1.437c-.32.586-.5 1.258-.469 1.934l-.031 3.34c0 .148.031.265.117.351.09.086.207.117.352.117h1.406zM10.47 2.734a.606.606 0 01.234.47V7.89a2.835 2.835 0 01-.762 1.843 2.65 2.65 0 01-1.816.735h-.234v6.328a.627.627 0 01-.235.5.587.587 0 01-.468.203c-.204 0-.383-.059-.5-.203-.145-.117-.204-.297-.204-.5v-6.328H6.25a2.66 2.66 0 01-1.844-.735 2.66 2.66 0 01-.734-1.843V3.203c0-.176.058-.351.203-.469a.627.627 0 01.5-.234c.176 0 .352.086.469.234a.606.606 0 01.234.47v3.515h1.406V3.262c0-.176.059-.352.204-.496a.717.717 0 01.5-.207c.175 0 .351.09.468.207.149.144.235.32.235.496v3.457h1.406V3.203c0-.176.058-.351.203-.469A.627.627 0 0110 2.5c.176 0 .352.086.469.234zM8.83 8.797c.202-.172.35-.406.41-.672H5.11c.055.266.204.5.407.672.207.18.441.265.734.265h1.875c.266 0 .5-.085.703-.265zm0 0" />
                        </svg>
                        <span className="flex-1 font-medium text-gray-700 group-hover:text-gray-900 dark:text-gray-200 dark:group-hover:text-white">
                          {menu.name}
                        </span>
                        <IoChevronForwardOutline />
                      </div>
                    </a>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuPreview;
