import type { CategoryKey } from "@/utils/selection-keys";
import type { CartLineItem, SelectionMap } from "@/types/builder";

export type BuilderStore = {
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
