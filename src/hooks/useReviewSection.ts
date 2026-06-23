import data from "@/db.json";
import useBuilderStore from "@/store/useBuilderStore";
import type { CartLineItem } from "@/types/builder";
import { useState } from "react";

const useReviewSection = () => {
  void useBuilderStore((state) => state.selections);
  const getCartDetails = useBuilderStore((state) => state.getCartDetails);
  const getCartTotal = useBuilderStore((state) => state.getCartTotal);
  const updateQuantity = useBuilderStore((state) => state.updateQuantity);

  const [savedSignature, setSavedSignature] = useState<string | null>(null);

  const cartItems = getCartDetails();
  const cartTotal = getCartTotal();
  const shipping = data.shipping;
  const currency = data.currency;
  const shippingPrice = Number(shipping?.cost ?? 0);
  const shippingIsFree = Boolean(shipping?.isFree);

  const cartOriginalTotal = Number(
    cartItems
      .reduce(
        (sum, item) =>
          sum + Number(item.originalPrice ?? item.unitPrice) * item.quantity,
        0,
      )
      .toFixed(2),
  );
  const totalOriginalPrice = Number(
    (cartOriginalTotal + (shippingIsFree ? shippingPrice : 0)).toFixed(2),
  );
  const cartSavings = Number(
    Math.max(0, totalOriginalPrice - cartTotal).toFixed(2),
  );
  const hasSavings = totalOriginalPrice > cartTotal;
  const cartSignature = cartItems
    .map((item) => `${item.key}:${item.quantity}`)
    .join("|");
  const isSaved = savedSignature === cartSignature;

  const formatPrice = (value: number) =>
    `${currency}${Number(value).toFixed(2)}`;
  const formatSubscriptionPrice = (value: number, frequency?: string | null) =>
    `${formatPrice(value)}/${frequency || "mo"}`;

  const groupedItems = cartItems.reduce<Record<string, CartLineItem[]>>(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }

      acc[item.category].push(item);
      return acc;
    },
    {},
  );

  const productGroups = Object.entries(groupedItems).filter(
    ([category]) => category !== "plans",
  );
  const planItem = groupedItems.plans?.[0] || null;

  const handleItemQuantityChange = (item: CartLineItem, delta: number) => {
    if (item.isFree) {
      return;
    }

    updateQuantity({
      category: item.category,
      productId: item.productId,
      variantColor: item.color,
      delta,
    });
  };

  const saveSystem = () => {
    setSavedSignature(cartSignature);
  };

  return {
    cartItems,
    cartSavings,
    cartSignature,
    cartTotal,
    formatPrice,
    formatSubscriptionPrice,
    hasSavings,
    handleItemQuantityChange,
    isSaved,
    planItem,
    productGroups,
    saveSystem,
    shipping,
    shippingIsFree,
    shippingPrice,
    totalOriginalPrice,
  };
};

export default useReviewSection;
