import useBuilderStore from "@/store/useBuilderStore";
import createItemKey from "@/utils/createItemKey";
import { useState } from "react";

const ProductCard = ({ product, categoryKey }) => {
  const updateQuantity = useBuilderStore((state) => state.updateQuantity);

  // const categorySelections = useBuilderStore(
  //   (state) => state.selections[categoryKey] || {},
  // );
  const totalProductQuantity = useBuilderStore((state) =>
    state.getProductTotalQuantity(categoryKey, product.id),
  );
  const hasVariants = Boolean(product.variants && product.variants.length > 0);
  const [activeColor, setActiveColor] = useState(() =>
    hasVariants ? product.variants[0].color : null,
  );

  const activeKey = createItemKey({
    productId: product.id,
    variantColor: activeColor,
  });
  // const currentQuantity = categorySelections[activeKey] || 0;
  const isSelected = totalProductQuantity > 0;

  const currentQuantity = useBuilderStore(
    (state) => state.selections[categoryKey]?.[activeKey] || 0
  );

  return (
    <article
      className={`relative flex flex-col gap-4.75 border-2 bg-white rounded-[10px] py-3.75 px-2.75 ${
        isSelected ? "border-[#4E2FD2B2]" : "border-transparent"
      }`}
    >
      <header className="relative">
        {product.discountPercent && (
          <span className="absolute top-0 left-0 bg-[#4E2FD2] text-white text-[12px] font-semibold px-1.5 py-0.5 rounded-full z-10">
            Save {product.discountPercent}%
          </span>
        )}

        <figure className="flex justify-center items-center pt-6 w-38 h-38 mx-auto ">
          <img src={product.imageUrl} alt={product.name} className="h-full" />
        </figure>
      </header>

      <div className="flex flex-col grow">
        <h3 className="text-[16px] font-semibold text-[#1F1F1F] leading-tight">
          {product.name}
        </h3>

        <p className="text-[12px] lg:text-[14px] text-[#1F1F1FBF] leading-relaxed mt-2 grow">
          {product.description}{" "}
          <a href="#" className="text-[#0000EE] font-medium underline">
            Learn More
          </a>
        </p>

        {product.variants && (
          <fieldset className="mt-2.5">
            <legend className="sr-only">Choose a color</legend>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((variant) => (
                <button
                  key={variant.color}
                  onClick={() => setActiveColor(variant.color)}
                  className={`flex items-center gap-1 cursor-pointer border-[0.5px] rounded-xs px-0.75 py-px transition-colors ${
                    activeColor === variant.color
                      ? "border-[#00a664] bg-[#f0faf5]"
                      : "border-[#CCCCCC]"
                  }`}
                >
                  <img
                    src={variant.thumbnailUrl}
                    alt={`${variant.color} thumbnail`}
                    className="w-5.5 h-5.5"
                  />
                  <span className="text-[10px] font-medium text-[#1F1F1F]">
                    {variant.color}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>
        )}

        <footer className="flex items-center justify-between mt-2.5">
          <div className="flex items-center gap-1">
            <button
              onClick={() =>
                updateQuantity({
                  category: categoryKey,
                  productId: product.id,
                  variantColor: activeColor,
                  delta: -1,
                })
              }
              disabled={currentQuantity === 0}
              className="w-5 h-5 rounded-sm border-2 text-[#525963] disabled:text-[#CED6DE] border-[#F0F4F7] flex justify-center items-center bg-[#F0F4F7] disabled:bg-transparent disabled:border-[#E6EBF0] disabled:cursor-not-allowed"
              aria-label="Decrease quantity"
            >
              <span className="font-semibold leading-none mt-px">&minus;</span>
            </button>

            <span className="text-center text-[16px] font-medium text-[#0B0D10] min-w-6.25">
              {currentQuantity}
            </span>

            <button
              onClick={() =>
                updateQuantity({
                  category: categoryKey,
                  productId: product.id,
                  variantColor: activeColor,
                  delta: 1,
                })
              }
              className="w-5 h-5 rounded-sm border-2 text-[#525963] disabled:text-[#CED6DE] border-[#F0F4F7] flex justify-center items-center bg-[#F0F4F7] disabled:bg-transparent disabled:border-[#E6EBF0] disabled:cursor-not-allowed"
              aria-label="Increase quantity"
            >
              <span className="text-[#525963] font-semibold leading-none mt-px">
                &#43;
              </span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-right">
            {product.originalPrice && (
              <span className="text-[16px] text-[#D8392B] line-through">
                ${product.originalPrice}
              </span>
            )}
            <span className="text-[16px] text-[#575757]">
              ${product.salePrice}
            </span>
          </div>
        </footer>
      </div>
    </article>
  );
};

export default ProductCard;
