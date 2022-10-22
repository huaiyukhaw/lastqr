import { MenuItem } from "./types";

export const getBasePrice = (menuItem: MenuItem) => {
  return Math.min(
    ...menuItem.variants.map((variant) => Number(variant.price))
  ).toFixed(2);
};
