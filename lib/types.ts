export type ShopPreview = {
  id: string;
  name: string;
  username: string;
};

export type Shop = {
  id?: string;
  user_id?: string;
  username?: string;
  name?: string;
  updated_at?: Date;
  status?: "active" | "paused" | "shutdown" | null;
  menu_ids: string[];
  cover_image: string | null;
  logo: string | null;
  phone_number: string | null;
  address: string | null;
};

export type Menu = {
  id?: string;
  slug?: string;
  status?: "active" | "paused" | "removed" | null;
  name: string;
  collections: MenuCollection[];
  items: MenuItem[];
};

export type MenuItemVariant = {
  id: string;
  name: string | null;
  price: number | null;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  variants: MenuItemVariant[];
  collection_id: string | null;
  image_url: string | null;
};

export type MenuCollection = {
  id: string;
  name: string;
  description: string | null;
  items: MenuItem[];
};

export type Qr = {
  id: string;
  title: string;
  description: string;
  dimension: string;
  format: "image/png" | "image/svg+xml" | "application/pdf";
};

export enum QrFormats {
  "image/png" = "image/png",
  "image/svg+xml" = "image/svg+xml",
  "application/pdf" = "application/pdf",
}

export type QrUrls = {
  [key in QrFormats]: string;
};
