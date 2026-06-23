import data from "@/db.json";
import useBuilderStore from "@/store/useBuilderStore";
import type { ProductCardProps } from "@/types/builder";
import createItemKey from "@/utils/createItemKey";
import { useState } from "react";

const getDefaultVariantColor = (product: ProductCardProps["product"]) =>
  product.variants?.find((variant) => variant.isDefault)?.color ??
  product.variants?.[0]?.color ??
  null;

const useProductCard = ({ product, categoryKey }: ProductCardProps) => {
  const updateQuantity = useBuilderStore((state) => state.updateQuantity);
  const totalProductQuantity = useBuilderStore((state) =>
    state.getProductTotalQuantity(categoryKey, product.id),
  );

  const [activeColor, setActiveColor] = useState(() =>
    getDefaultVariantColor(product),
  );

  const activeKey = createItemKey({
    productId: product.id,
    variantColor: activeColor,
  });

  const currentQuantity = useBuilderStore(
    (state) => state.selections[categoryKey]?.[activeKey] || 0,
  );

  const unitSalePrice = Number(product.salePrice ?? 0);
  const lineSalePrice = Number((unitSalePrice * currentQuantity).toFixed(2));
  const originalPrice =
    typeof product.originalPrice === "number" ? product.originalPrice : null;
  const lineOriginalPrice =
    originalPrice === null
      ? null
      : Number((originalPrice * currentQuantity).toFixed(2));
  const currency = data.currency;

  const formatPrice = (value: number) =>
    `${currency}${Number(value).toFixed(2)}`;

  const handleQuantityChange = (delta: number) => {
    updateQuantity({
      category: categoryKey,
      productId: product.id,
      variantColor: activeColor,
      delta,
    });
  };

  return {
    activeColor,
    currentQuantity,
    formatPrice,
    handleQuantityChange,
    isSelected: totalProductQuantity > 0,
    lineOriginalPrice,
    lineSalePrice,
    setActiveColor,
  };
};

export default useProductCard;
