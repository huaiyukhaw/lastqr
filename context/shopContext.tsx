import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type {
  Menu,
  MenuCollection,
  MenuItem,
  Shop,
  ShopPreview,
} from "../lib/types";
import { useAuth } from "./authContext";

export type ShopContextType = {
  loaded: boolean;
  shops: ShopPreview[];
  shop: Shop;
  menus: Menu[];
  numberOfShops: number;
  createShop: (newShop?: Shop) => Promise<void>;
  updateShop: (update: Shop) => Promise<void>;
  shutdownShop: (targetShop: Shop) => Promise<void>;
  currentShopId: string | null;
  setCurrentShopId: React.Dispatch<React.SetStateAction<string | null>>;
  getMenus: () => Promise<void>;
  createMenu: (newMenu: Menu) => Promise<Menu>;
  updateMenu: (updatedMenu: Menu) => Promise<void>;
  deleteMenu: (targetMenuId: Menu["id"]) => Promise<void>;
  updateMenuItem: (
    currentMenu: Menu,
    updatedMenuItem: MenuItem
  ) => Promise<void>;
  removeMenuItem: (
    currentMenu: Menu,
    targetMenuItem: MenuItem
  ) => Promise<void>;
  addMenuItem: (currentMenu: Menu, newMenuItem: MenuItem) => Promise<void>;
  removeCollection: (
    currentMenu: Menu,
    targetCollection: MenuCollection
  ) => Promise<void>;
  moveUpCollection: (
    currentMenu: Menu,
    targetCollection: MenuCollection
  ) => Promise<void>;
  moveDownCollection: (
    currentMenu: Menu,
    targetCollection: MenuCollection
  ) => Promise<void>;
  moveUpMenuItem: (currentMenu: Menu, targetItem: MenuItem) => Promise<void>;
  moveDownMenuItem: (currentMenu: Menu, targetItem: MenuItem) => Promise<void>;
};

const ShopContext = createContext<ShopContextType>({} as ShopContextType);

export const ShopProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { session } = useAuth();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [shops, setShops] = useState<ShopPreview[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [currentShopId, setCurrentShopId] = useState<string | null>(null);
  const [shop, setShop] = useState<Shop>({} as Shop);

  useEffect(() => {
    if (session) {
      getShops();
    }
  }, [session]);

  useEffect(() => {
    if (shops.length > 0) {
      if (currentShopId) {
        getShop();
        getMenus();
      } else {
        const currentLocalStorage = localStorage.getItem("lastqr-app-data");
        if (currentLocalStorage) {
          const localStorageData = JSON.parse(currentLocalStorage);
          if (localStorageData.shop_id) {
            setCurrentShopId((localStorageData.shop_id as string) ?? null);
          }
        }
      }
    } else {
      setCurrentShopId(null);
      setShop({} as Shop);
    }
  }, [shops, currentShopId]);

  useEffect(() => {
    if (currentShopId) {
      const currentLocalStorage = localStorage.getItem("lastqr-app-data");

      let localStorageData;

      if (currentLocalStorage) {
        const currentLocalStorageData = JSON.parse(currentLocalStorage);
        localStorageData = {
          ...currentLocalStorageData,
          shop_id: currentShopId,
        };
      } else {
        localStorageData = {
          shop_id: currentShopId,
        };
      }
      localStorage.setItem("lastqr-app-data", JSON.stringify(localStorageData));
    }
  }, [currentShopId]);

  const getShops = async () => {
    const { data, error, status } = await supabase
      .from("shops")
      .select("id, name, username")
      .eq("user_id", session?.user.id)
      .in("status", ["active", "paused"]);

    if (error && status !== 406) {
      throw error;
    }

    if (data) {
      setShops(data);
      setLoaded(true);
    }
  };

  const getShop = async () => {
    const { data, error, status } = await supabase
      .from("shops")
      .select()
      .eq("id", currentShopId)
      .in("status", ["active", "paused"])
      .single();

    if (error) {
      console.error(error);
    }
    if (error && status !== 406) {
      throw error;
    }

    if (data) {
      setShop(data);
    }
  };

  const createShop = async (newShop?: Shop) => {
    const newShopArgs = {
      user_id: session?.user.id,
      name: "Untitled shop",
      status: "active",
      ...newShop,
    };

    const { data, error } = await supabase
      .from("shops")
      .insert(newShopArgs)
      .select()
      .single();

    if (data) {
      setCurrentShopId(data.id);
      getShops();
    }

    if (error) {
      throw error;
    }
  };

  const updateShop = async (update: Shop) => {
    const { data, error } = await supabase
      .from("shops")
      .update(update)
      .eq("id", currentShopId)
      .select()
      .single();
    if (data) {
      setShop(data);
    }
    if (error) {
      throw error;
    }
  };

  const shutdownShop = async (targetShop: Shop) => {
    if (targetShop.menu_ids.length > 0) {
      const { error: deleteMenuError } = await supabase
        .from("menus")
        .update({ status: "removed" })
        .eq("shop_id", targetShop.id);
      if (deleteMenuError) {
        throw deleteMenuError;
      }
    }
    setCurrentShopId(
      shops.filter((shop) => shop.id !== targetShop.id)[0]?.id ?? null
    );
    const { error } = await supabase
      .from("shops")
      .update({ status: "shutdown" })
      .eq("id", targetShop.id);

    if (error) {
      throw error;
    } else {
      getShops();
    }
  };

  const getMenus = async () => {
    const { data, error } = await supabase
      .from("menus")
      .select()
      .eq("shop_id", currentShopId);

    if (data) {
      setMenus(data);
    }
    if (error) {
      throw error;
    }
  };

  const updateMenuIds = async (menu_ids: string[]) => {
    const { data, error } = await supabase
      .from("shops")
      .update({
        menu_ids: menu_ids,
      })
      .eq("id", currentShopId)
      .select()
      .single();

    if (error) {
      throw error;
    }
    if (data) {
      setShop(data);
    }
  };

  const createMenu = async (newMenu: Menu) => {
    const newMenuArgs = {
      user_id: session?.user.id,
      shop_id: currentShopId,
      updated_at: new Date(),
      ...newMenu,
    };

    const { data: menuData, error } = await supabase
      .from("menus")
      .insert(newMenuArgs)
      .select()
      .single();

    if (error) {
      throw error;
    }
    if (menuData) {
      const newMenuIds = shop.menu_ids
        ? [...shop.menu_ids!, menuData.id]
        : [menuData.id];
      await updateMenuIds(newMenuIds);
      await getMenus();
    }
    return menuData as Menu;
  };

  const updateMenu = async (updatedMenu: Menu) => {
    const { error } = await supabase
      .from("menus")
      .update(updatedMenu)
      .eq("id", updatedMenu.id);

    if (error) {
      throw error;
    }
  };

  const deleteMenu = async (targetMenuId: Menu["id"]) => {
    const { error } = await supabase
      .from("menus")
      .delete()
      .eq("id", targetMenuId);

    if (error) {
      throw error;
    } else {
      const newMenuIds = shop.menu_ids!.filter((id) => id !== targetMenuId);
      await updateMenuIds(newMenuIds);
      await getMenus();
    }
  };

  const updateMenuItem = async (
    currentMenu: Menu,
    updatedMenuItem: MenuItem
  ) => {
    const updatedMenu: Menu = JSON.parse(JSON.stringify(currentMenu));
    const menuItemIndex = updatedMenu.items.findIndex(
      (item) => item.id === updatedMenuItem.id
    );
    updatedMenu.items[menuItemIndex] = updatedMenuItem;
    if (updatedMenuItem.collection_id) {
      const collectionIndex = updatedMenu.collections.findIndex(
        (collection) => collection.id === updatedMenuItem.collection_id
      );
      const menuItemIndexByCollection = updatedMenu.collections[
        collectionIndex
      ].items.findIndex((item) => item.id === updatedMenuItem.id);
      updatedMenu.collections[collectionIndex].items[
        menuItemIndexByCollection
      ] = updatedMenuItem;
    }
    await updateMenu(updatedMenu);
  };

  const removeMenuItem = async (
    currentMenu: Menu,
    targetMenuItem: MenuItem
  ) => {
    const updatedMenu: Menu = JSON.parse(JSON.stringify(currentMenu));
    const menuItemIndex = updatedMenu.items.findIndex(
      (item) => item.id === targetMenuItem.id
    );
    updatedMenu.items.splice(menuItemIndex, 1);
    if (targetMenuItem.collection_id) {
      const collectionIndex = updatedMenu.collections.findIndex(
        (collection) => collection.id === targetMenuItem.collection_id
      );
      const menuItemIndexByCollection = updatedMenu.collections[
        collectionIndex
      ].items.findIndex((item) => item.id === targetMenuItem.id);
      updatedMenu.collections[collectionIndex].items.splice(
        menuItemIndexByCollection,
        1
      );
    }
    await updateMenu(updatedMenu);
  };

  const addMenuItem = async (currentMenu: Menu, newMenuItem: MenuItem) => {
    const updatedMenu: Menu = JSON.parse(JSON.stringify(currentMenu));
    if (newMenuItem.collection_id) {
      const collectionIndex = updatedMenu.collections.findIndex(
        (collection) => collection.id === newMenuItem.collection_id
      );
      updatedMenu.collections[collectionIndex].items.push(newMenuItem);
    }
    updatedMenu.items.push(newMenuItem);
    await updateMenu(updatedMenu);
  };

  const removeCollection = async (
    currentMenu: Menu,
    targetCollection: MenuCollection
  ) => {
    const updatedMenu: Menu = JSON.parse(JSON.stringify(currentMenu));
    const collectionIndex = updatedMenu.collections.findIndex(
      (item) => item.id === targetCollection.id
    );
    updatedMenu.collections.splice(collectionIndex, 1);
    updatedMenu.items = updatedMenu.items.filter(
      (item) => item.collection_id !== targetCollection.id
    );
    await updateMenu(updatedMenu);
  };

  const moveUpCollection = async (
    currentMenu: Menu,
    targetCollection: MenuCollection
  ) => {
    const updatedMenu: Menu = JSON.parse(JSON.stringify(currentMenu));
    const collectionIndex = updatedMenu.collections.findIndex(
      (item) => item.id === targetCollection.id
    );
    if (collectionIndex === 0) {
      console.log("exceed array boundary");
      return;
    }
    updatedMenu.collections[collectionIndex] =
      updatedMenu.collections[collectionIndex - 1];
    updatedMenu.collections[collectionIndex - 1] = targetCollection;

    await updateMenu(updatedMenu);
  };

  const moveDownCollection = async (
    currentMenu: Menu,
    targetCollection: MenuCollection
  ) => {
    const updatedMenu: Menu = JSON.parse(JSON.stringify(currentMenu));
    const collectionIndex = updatedMenu.collections.findIndex(
      (item) => item.id === targetCollection.id
    );
    if (
      collectionIndex === updatedMenu.collections.length - 1 ||
      collectionIndex === -1
    ) {
      console.log("exceed array boundary");
      return;
    }
    updatedMenu.collections[collectionIndex] =
      updatedMenu.collections[collectionIndex + 1];
    updatedMenu.collections[collectionIndex + 1] = targetCollection;

    await updateMenu(updatedMenu);
  };

  const moveUpMenuItem = async (currentMenu: Menu, targetItem: MenuItem) => {
    const updatedMenu: Menu = JSON.parse(JSON.stringify(currentMenu));
    const menuItemIndex = currentMenu.items.findIndex(
      (item) => item.id === targetItem.id
    );
    if (menuItemIndex === 0) {
      return;
    }
    updatedMenu.items[menuItemIndex] = updatedMenu.items[menuItemIndex - 1];
    updatedMenu.items[menuItemIndex - 1] = targetItem;

    if (targetItem.collection_id) {
      const collectionIndex = updatedMenu.collections.findIndex(
        (collection) => collection.id === targetItem.collection_id
      );
      const menuItemIndexByCollection = currentMenu.collections[
        collectionIndex
      ].items.findIndex((item) => item.id === targetItem.id);
      if (menuItemIndexByCollection <= 0) {
        console.log("exceed array boundary");
        return;
      }
      updatedMenu.collections[collectionIndex].items[
        menuItemIndexByCollection
      ] =
        updatedMenu.collections[collectionIndex].items[
          menuItemIndexByCollection - 1
        ];
      updatedMenu.collections[collectionIndex].items[
        menuItemIndexByCollection - 1
      ] = targetItem;
    }
    await updateMenu(updatedMenu);
  };

  const moveDownMenuItem = async (currentMenu: Menu, targetItem: MenuItem) => {
    const updatedMenu: Menu = JSON.parse(JSON.stringify(currentMenu));
    const menuItemIndex = currentMenu.items.findIndex(
      (item) => item.id === targetItem.id
    );
    if (menuItemIndex === updatedMenu.items.length - 1) {
      console.log("exceed array boundary");
      return;
    }
    updatedMenu.items[menuItemIndex] = updatedMenu.items[menuItemIndex + 1];
    updatedMenu.items[menuItemIndex + 1] = targetItem;

    if (targetItem.collection_id) {
      const collectionIndex = updatedMenu.collections.findIndex(
        (collection) => collection.id === targetItem.collection_id
      );
      const menuItemIndexByCollection = currentMenu.collections[
        collectionIndex
      ].items.findIndex((item) => item.id === targetItem.id);
      if (
        menuItemIndexByCollection ===
          updatedMenu.collections[collectionIndex].items.length - 1 ||
        menuItemIndexByCollection === -1
      ) {
        console.log("exceed array boundary");
        return;
      }
      updatedMenu.collections[collectionIndex].items[
        menuItemIndexByCollection
      ] =
        updatedMenu.collections[collectionIndex].items[
          menuItemIndexByCollection + 1
        ];
      updatedMenu.collections[collectionIndex].items[
        menuItemIndexByCollection + 1
      ] = targetItem;
    }

    await updateMenu(updatedMenu);
  };

  const value = {
    loaded: loaded,
    shops: shops,
    shop: shop,
    menus: menus,
    numberOfShops: shops.length,
    createShop: createShop,
    updateShop: updateShop,
    shutdownShop: shutdownShop,
    currentShopId: currentShopId,
    setCurrentShopId: setCurrentShopId,
    getMenus: getMenus,
    createMenu: createMenu,
    updateMenu: updateMenu,
    deleteMenu: deleteMenu,
    updateMenuItem: updateMenuItem,
    removeMenuItem: removeMenuItem,
    addMenuItem: addMenuItem,
    removeCollection: removeCollection,
    moveUpCollection: moveUpCollection,
    moveDownCollection: moveDownCollection,
    moveUpMenuItem: moveUpMenuItem,
    moveDownMenuItem: moveDownMenuItem,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export const useShop = () => {
  return useContext(ShopContext);
};
