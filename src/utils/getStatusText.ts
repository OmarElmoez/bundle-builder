const getStatusText = (selections, selectionKey) => {
  const selectedItems = selections[selectionKey] || {};
  const uniqueProducts = new Set(
    Object.entries(selectedItems)
      .filter(([, quantity]) => quantity > 0)
      .map(([key]) => key.split("::")[0]),
  );

  const count = uniqueProducts.size;
  return count > 0 ? `${count} selected` : "No selections";
};

export default getStatusText