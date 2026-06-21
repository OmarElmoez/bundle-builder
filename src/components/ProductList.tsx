import data from "@/db.json";
import type { CategoryKey } from "@/utils/selection-keys";
import ProductCard from "./ProductCard";

const ProductList = ({ category }: { category: CategoryKey }) => {
  const items = data[category];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5  items-stretch gap-4">
      {items.map((item) => (
        <ProductCard
          key={item.id}
          product={item}
          categoryKey={category}
        />
      ))}
    </div>
  );
};

export default ProductList;
