import { create } from "zustand";
import { persist } from "zustand/middleware";
import data from "@/db.json";
import SELECTION_KEYS, { type CategoryKey } from "@/utils/selection-keys";
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

      getCartDetails: () => {
        const { selections } = get();
        const lineItems = [];

        Object.entries(selections).forEach(([categoryKey, items]) => {
          Object.entries(items).forEach(([itemKey, quantity]) => {
            const [baseProductId, variantColor] = itemKey.split('::');
            
            const productArray = data[categoryKey as CategoryKey] || [];
            const product = productArray.find((p) => p.id === baseProductId);
            
            if (product) {
              const variant = variantColor && "variants" in product
                ? product.variants.find(v => v.color === variantColor)
                : null;

              const originalPrice = "originalPrice" in product ? product.originalPrice : product.salePrice;

              lineItems.push({
                key: itemKey,
                category: categoryKey,
                productId: baseProductId,
                name: product.name,
                color: variantColor || null,
                imageUrl: variant ? variant.thumbnailUrl : product.imageUrl,
                quantity: quantity,
                unitPrice: product.salePrice,
                originalPrice,
                lineTotal: Number((product.salePrice * quantity).toFixed(2)),
              });
            }
          });
        });

        return lineItems;
      },

      getProductTotalQuantity: (category, productId) => {
        const categoryItems = get().selections[category] || {};
        return Object.entries(categoryItems).reduce((total, [key, qty]) => {
          return key.startsWith(productId) ? total + qty : total;
        }, 0);
      },

      getCartTotal: () => {
        const details = get().getCartDetails();
        return Number(details.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2));
      }
    }),
    {
      name: "wyze-builder-storage",
    },
  ),
);

export default useBuilderStore;
