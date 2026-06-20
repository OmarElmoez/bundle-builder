import { create } from "zustand";
import { persist } from "zustand/middleware";
import data from "@/db.json";
import SELECTION_KEYS from "@/utils/selection-keys";
import createItemKey from "@/utils/createItemKey";

const getDefaultProductKey = (product) => {
  if (!product) return null;
  const defaultVariant =
    product.variants?.find((v) => v.isDefault) || product.variants?.[0];
  return createItemKey({
    productId: product.id,
    variantColor: defaultVariant?.color,
  });
};

const useBuilderStore = create(
  persist(
    (set, get) => ({
      // 3. Initialize using your constants and your dynamic db.json data
      selections: {
        [SELECTION_KEYS.cameras]: {
          [getDefaultProductKey(data.cameras[0])]: 1,
          [getDefaultProductKey(data.cameras[1])]: 2,
        },
        [SELECTION_KEYS.plans]: {
          [getDefaultProductKey(data.plans[0])]: 1,
        },
        [SELECTION_KEYS.sensors]: {
          [getDefaultProductKey(data.sensors[0])]: 1,
          [getDefaultProductKey(data.sensors[1])]: 1,
        },
        [SELECTION_KEYS.accessories]: {
          [getDefaultProductKey(data.accessories[0])]: 1,
        },
      },

      // 4. The single smart action for updates
      updateQuantity: ({ category, productId, variantColor, delta }) => {
        set((state) => {
          const key = createItemKey({productId, variantColor});
          const currentCategory = state.selections[category] || {};
          const currentQty = currentCategory[key] || 0;

          const newQty = Math.max(0, currentQty + delta);

          const updatedCategory = { ...currentCategory };

          if (newQty === 0) {
            delete updatedCategory[key];
          } else {
            updatedCategory[key] = newQty;
          }

          return {
            selections: {
              ...state.selections,
              [category]: updatedCategory,
            },
          };
        });
      },

      // Optional helper for the Camera Card's purple border logic
      getProductTotalQuantity: (category, productId) => {
        const categoryItems = get().selections[category] || {};
        return Object.entries(categoryItems).reduce((total, [key, qty]) => {
          return key.startsWith(productId) ? total + qty : total;
        }, 0);
      }
    }),
    {
      name: "wyze-builder-storage",
    },
  ),
);

export default useBuilderStore;
