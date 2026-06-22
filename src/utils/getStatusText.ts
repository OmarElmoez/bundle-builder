import type { SelectionMap } from "@/types/builder";
import type { CategoryKey } from "@/utils/selection-keys";

const getStatusText = (
  selections: Record<CategoryKey, SelectionMap>,
  selectionKey: CategoryKey,
) => {
  const selectedItems = selections[selectionKey] || {};
  const uniqueProducts = new Set(
    Object.entries(selectedItems)
      .filter(([, quantity]) => quantity > 0)
      .map(([itemKey]) => itemKey.split("::")[0]),
  );

  const count = uniqueProducts.size;
  return count > 0 ? `${count} selected` : "No selections";
};

export default getStatusText;
