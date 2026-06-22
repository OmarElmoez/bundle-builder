import { create } from "zustand";
import { persist } from "zustand/middleware";
import data from "@/db.json";
import SELECTION_KEYS, { type CategoryKey } from "@/utils/selection-keys";
import createItemKey from "@/utils/createItemKey";

type Variant = {
  color: string;
  isDefault?: boolean;
  quantity?: number;
  thumbnailUrl?: string;
};

type Product = {
  id: string;
  name: string;
  salePrice?: number;
  originalPrice?: number | null;
  imageUrl?: string;
  frequency?: string;
  isFree?: boolean;
  quantity?: number;
  variants?: Variant[];
};

type SelectionMap = Record<string, number>;

type CartLineItem = {
  key: string | null;
  category: CategoryKey;
  productId: string;
  name: string;
  color: string | null;
  imageUrl?: string;
  quantity: number;
  unitPrice: number;
  originalPrice: number | null | undefined;
  frequency: string | null;
  isFree: boolean;
  lineTotal: number;
};

type BuilderStore = {
  selections: Record<CategoryKey, SelectionMap>;
  updateQuantity: (args: {
    category: CategoryKey;
    productId: string;
    variantColor?: string | null;
    delta: number;
  }) => void;
  getCartDetails: () => CartLineItem[];
  getProductTotalQuantity: (category: CategoryKey, productId: string) => number;
  getCartTotal: () => number;
};

type DbData = {
  cameras: Product[];
  plans: Product[];
  sensors: Product[];
  accessories: Product[];
};

const db = data as DbData;

const getDefaultProductKey = (product: Product | undefined | null) => {
  if (!product) return null;
  const defaultVariant =
    product.variants?.find((v) => v.isDefault) || product.variants?.[0];
  return createItemKey({
    productId: product.id,
    variantColor: defaultVariant?.color,
  });
};

const getDefaultProductQuantity = (product: Product | undefined | null) => {
  if (!product) return 0;

  const defaultVariant =
    product.variants?.find((v) => v.isDefault) || product.variants?.[0];

  if (defaultVariant) {
    return Number(defaultVariant.quantity ?? 0);
  }

  return Number(product.quantity ?? 0);
};

const useBuilderStore = create<BuilderStore>()(
  persist(
    (set, get) => ({
      selections: {
        [SELECTION_KEYS.cameras]: {
          [getDefaultProductKey(db.cameras[0])!]: getDefaultProductQuantity(db.cameras[0]),
          [getDefaultProductKey(db.cameras[1])!]: getDefaultProductQuantity(db.cameras[1]),
        },
        [SELECTION_KEYS.plans]: {
          [getDefaultProductKey(db.plans[0])!]: getDefaultProductQuantity(db.plans[0]),
        },
        [SELECTION_KEYS.sensors]: {
          [getDefaultProductKey(db.sensors[0])!]: getDefaultProductQuantity(db.sensors[0]),
          [getDefaultProductKey(db.sensors[1])!]: getDefaultProductQuantity(db.sensors[1]),
        },
        [SELECTION_KEYS.accessories]: {
          [getDefaultProductKey(db.accessories[0])!]: getDefaultProductQuantity(db.accessories[0]),
        },
      },

      updateQuantity: ({ category, productId, variantColor, delta }) => {
        set((state) => {
          const key = createItemKey({ productId, variantColor });
          if (!key) {
            return state;
          }

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
        const lineItems: CartLineItem[] = [];

        Object.entries(selections).forEach(([categoryKey, items]) => {
          Object.entries(items).forEach(([itemKey, quantity]) => {
            const itemQuantity = Number(quantity);
            const [baseProductId, variantColor] = itemKey.split("::");
            
            const productArray = db[categoryKey as keyof DbData] || [];
            const product = productArray.find((p) => p.id === baseProductId);
            
            if (product) {
              const variant = variantColor && "variants" in product
                ? product.variants?.find((v) => v.color === variantColor)
                : null;

              const originalPrice = "originalPrice" in product
                ? product.originalPrice
                : null;
              const isFree = "isFree" in product ? Boolean(product.isFree) : false;
              const unitPrice = Number(product.salePrice ?? 0);
              const lineTotal = isFree ? 0 : Number((unitPrice * itemQuantity).toFixed(2));

              lineItems.push({
                key: itemKey,
                category: categoryKey as CategoryKey,
                productId: baseProductId,
                name: product.name,
                color: variantColor || null,
                imageUrl: variant ? variant.thumbnailUrl : product.imageUrl,
                quantity: itemQuantity,
                unitPrice,
                originalPrice,
                frequency: product.frequency ?? null,
                isFree,
                lineTotal,
              });
            }
          });
        });

        return lineItems;
      },

      getProductTotalQuantity: (category, productId) => {
        const categoryItems = get().selections[category] || {};
        return Object.entries(categoryItems).reduce((total, [key, qty]) => {
          const itemQuantity = Number(qty);
          const isSameProduct = key === productId || key.startsWith(`${productId}::`);
          return isSameProduct ? total + itemQuantity : total;
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
