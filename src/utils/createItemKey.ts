const createItemKey = ({
  productId,
  variantColor,
}: {
  productId: string;
  variantColor?: string | null;
}) => {
  if (!productId) return null;
  // If the color exists (and isn't null/undefined), append it. Otherwise, just use the ID.
  return variantColor ? `${productId}::${variantColor}` : productId;
};

export default createItemKey;
