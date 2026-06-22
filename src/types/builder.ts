import type { CategoryKey } from "@/utils/selection-keys";

export type Variant = {
  color: string;
  isDefault?: boolean;
  quantity?: number;
  thumbnailUrl?: string;
};

export type Product = {
  id: string;
  name: string;
  description?: string;
  salePrice?: number;
  originalPrice?: number | null;
  imageUrl?: string;
  frequency?: string;
  isFree?: boolean;
  quantity?: number;
  discountPercent?: number;
  isDefault?: boolean;
  variants?: Variant[];
};

export type SelectionMap = Record<string, number>;

export type CartLineItem = {
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

export type BuilderStep = {
  id: number;
  title: string;
  icon: string;
  selectionKey: CategoryKey;
  status?: string;
};

export type ProductCardProps = {
  product: Product;
  categoryKey: CategoryKey;
};

export type ProductListProps = {
  category: CategoryKey;
};

export type AccordionItemProps = {
  step: BuilderStep;
  isOpen: boolean;
  onToggle: () => void;
  onAdvance: () => void;
  nextStepTitle?: string;
};

export type DbData = {
  currency: string;
  cameras: Product[];
  plans: Product[];
  sensors: Product[];
  accessories: Product[];
  shipping: {
    method: string;
    cost: number;
    isFree: boolean;
    imageUrl: string;
  };
};
