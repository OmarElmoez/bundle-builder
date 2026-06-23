import data from "@/db.json";
import useBuilderStore from "@/store/useBuilderStore";
import type { CartLineItem } from "@/types/builder";
import { useState } from "react";

const ReviewSection = () => {
  const selections = useBuilderStore((state) => state.selections);
  const getCartDetails = useBuilderStore((state) => state.getCartDetails);
  const getCartTotal = useBuilderStore((state) => state.getCartTotal);
  const updateQuantity = useBuilderStore((state) => state.updateQuantity);
  void selections;
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

  const groupedItems = cartItems.reduce<Record<string, CartLineItem[]>>((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});
  const productGroups = Object.entries(groupedItems).filter(
    ([category]) => category !== "plans",
  );
  const planItem = groupedItems.plans?.[0] || null;

  if (cartItems.length === 0) {
    return (
      <div className="bg-[#f2f5fa] p-8 rounded-2xl text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Your security system
        </h2>
        <p className="text-gray-500 text-sm">Your cart is currently empty.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#EDF4FF] py-3.75 px-5 xl:px-15 lg:rounded-[10px] flex flex-col xl:flex-row gap-10 md:mt-8.5 lg:w-150 xl:w-full">
      <div>
        <header>
          <p className="text-[#484848] text-[10px] md:text-xs font-medium uppercase tracking-widest lg:hidden">
            Review
          </p>
          <h2 className="text-[22px] xl:text-[28px] font-semibold text-[#1F1F1F] mb-1 mt-6.25 lg:mt-0">
            Your security system
          </h2>
          <p className="text-[#1F1F1FBF] text-xs lg:text-sm xl:text-base font-medium w-[85%] mb-2.5">
            Review your personalized protection system designed to keep what
            matters most safe.
          </p>
        </header>

        <div className="space-y-2.5">
          {productGroups.map(([category, items]) => (
            <div
              key={category}
              className="border border-[#CED6DE] border-r-0 border-l-0 border-b-0 pt-3.75"
            >
              <h3 className="text-xs text-[#A8B2BD] uppercase tracking-widest mb-3">
                {category}
              </h3>

              <ul className="space-y-3">
                {items.map((item) => (
                  <li
                    key={item.key}
                    className="flex items-center justify-between group gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-white p-2 rounded-xl w-10.25 h-10.25 flex items-center justify-center shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs lg:text-sm xl:text-lg font-medium text-[#0B0D10]">
                          {item.name}
                        </p>
                        {item.color && (
                          <p className="text-[12px] text-gray-500">
                            Color: {item.color}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            !item.isFree &&
                            updateQuantity({
                              category: item.category,
                              productId: item.productId,
                              variantColor: item.color,
                              delta: -1,
                            })
                          }
                          disabled={item.isFree}
                          className="cursor-pointer w-5 h-5 rounded-sm border-2 text-[#575757] border-[#F0F4F7] flex justify-center items-center bg-white disabled:bg-[#F1F1F2] disabled:border-[#E6EBF0] disabled:cursor-not-allowed"
                          aria-label="Decrease quantity"
                        >
                          <span className="font-medium leading-none mt-px">
                            &minus;
                          </span>
                        </button>
                        <span className="text-sm font-semibold w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            !item.isFree &&
                            updateQuantity({
                              category: item.category,
                              productId: item.productId,
                              variantColor: item.color,
                              delta: 1,
                            })
                          }
                          disabled={item.isFree}
                          className="cursor-pointer w-5 h-5 rounded-sm border-2 text-[#525963] border-[#F0F4F7] flex justify-center items-center bg-white disabled:bg-[#F1F1F2] disabled:border-[#E6EBF0] disabled:cursor-not-allowed"
                          aria-label="Increase quantity"
                        >
                          <span className="text-[#525963] font-medium leading-none mt-px">
                            &#43;
                          </span>
                        </button>
                      </div>

                      <div className="flex flex-col xl:flex-row xl:gap-2.5 text-xs lg:text-sm xl:text-base items-end ml-2 max-w-13 md:max-w-none">
                        {((item.isFree && item.unitPrice > 0) ||
                          (item.originalPrice &&
                            item.originalPrice > item.unitPrice)) && (
                          <span className=" text-[#6F7882] font-medium line-through leading-none">
                            {formatPrice(item.unitPrice * item.quantity)}
                          </span>
                        )}
                        <span className="font-semibold text-[#4E2FD2] leading-none">
                          {item.isFree
                            ? "FREE"
                            : item.unitPrice === 0
                              ? "FREE"
                              : formatPrice(item.lineTotal)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {planItem && (
            <div className="pt-3.75 border-t border-[#CED6DE]">
              <h3 className="md:hidden text-xs text-[#A8B2BD] uppercase tracking-widest mb-3">
                Home monitoring plan
              </h3>
              <h3 className="hidden md:block text-xs text-[#A8B2BD] uppercase tracking-widest mb-3">
                PLAN
              </h3>

              <div className="space-y-0 rounded-2xl">
                <div className="flex items-center justify-between group gap-4">
                  <div className="flex items-center min-w-0 -mt-2">
                    <div className="w-10.25 h-10.25 flex items-center justify-start shrink-0">
                      <img
                        src={planItem.imageUrl}
                        alt={planItem.name}
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm lg:text-base xl:text-xl font-bold leading-tight truncate">
                        <span className="text-black">
                          {planItem.name.split(" ")[0]}
                        </span>{" "}
                        <span className="text-[#4E2FD2]">
                          {planItem.name.split(" ").slice(1).join(" ")}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col xl:flex-row xl:gap-2.5 items-end text-xs lg:text-sm xl:text-base">
                    {planItem.originalPrice &&
                      planItem.originalPrice > planItem.unitPrice && (
                        <span className="font-medium text-[#6F7882] line-through leading-none">
                          {formatSubscriptionPrice(
                            planItem.originalPrice,
                            planItem.frequency,
                          )}
                        </span>
                      )}
                    <span className=" font-semibold text-[#4E2FD2] leading-none">
                      {formatSubscriptionPrice(
                        planItem.unitPrice,
                        planItem.frequency,
                      )}
                    </span>
                  </div>
                </div>

                <hr className="border-[#CED6DE]" />

                <div className="flex items-center justify-between group gap-4 py-2.5">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="bg-white rounded-xl w-10.25 h-10.25 flex items-center justify-center shrink-0 shadow-[0_1px_2px_rgba(15,23,42,0.08)]">
                      <img
                        src={data.shipping.imageUrl}
                        alt={data.shipping.method}
                        className="w-7 h-7 object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs lg:text-sm xl:text-lg font-medium text-[#0B0D10] leading-tight truncate">
                        {data.shipping.method}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end xl:flex-row xl:gap-2.5 text-xs lg:text-sm xl:text-base">
                    {shippingIsFree && shippingPrice > 0 && (
                      <span className="font-medium text-[#6F7882] line-through leading-none">
                        {formatPrice(shippingPrice)}
                      </span>
                    )}
                    <span className="font-semibold text-[#4f38d4] leading-none">
                      {shippingIsFree ? "FREE" : formatPrice(shippingPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="w-full flex flex-col flex-1 pt-2">
        <div className="flex flex-col items-end w-full mb-1">

          <div className="w-full flex lg:flex-row xl:flex-col">

            <div className="flex justify-between items-center gap-6.25">
              <div className="size-19.5 xl:size-32.75 shrink-0">
                <img src="/assets/images/satisfaction-badge.webp" alt="satisfaction badge" />
              </div>

              <div className="hidden xl:block text-base xl:text-lg text-[#1F1F1F] space-y-2">
                <h4 className="font-semibold">30-day hassle-free returns</h4>
                <p>If you're not totally in love with the product, we will refund you 100%.</p>
              </div>
            </div>

            <div className="flex flex-col xl:flex-row xl:justify-between items-end xl:items-center w-full gap-2 py-2.5">
              <span className="bg-[#4f38d4] text-white text-xs xl:text-base font-medium px-2 py-1 rounded-[3px]">
                as low as {formatPrice(19.19)}/mo
              </span>
              <div className="text-right">
                {hasSavings && (
                  <span className="text-lg xl:text-[22px] font-medium text-[#6F7882] line-through mr-2">
                    {formatPrice(totalOriginalPrice)}
                  </span>
                )}
                <span className="text-2xl xl:text-[32px] font-bold text-[#4E2FD2]">
                  {formatPrice(cartTotal)}
                </span>
              </div>
            </div>
          </div>


          {hasSavings && (
            <p className="text-[#0AA288] text-xs xl:text-sm font-semibold w-full text-center mt-2">
              Congrats! You're saving {formatPrice(cartSavings)} on your
              security bundle!
            </p>
          )}
        </div>

        <button className="w-full bg-[#4f38d4] text-white text-[17px] py-3.5 rounded-sm font-bold font-ttnorms-pro hover:bg-[#3d2ba8] transition-colors">
          Checkout
        </button>

        {isSaved ? (
          <div className="w-full rounded-[10px] border border-[#8DD3A8] bg-[#EAF8EF] px-4 py-3 mt-2">
            <p className="text-sm font-semibold text-[#116A3A]">
              Your system is saved.
            </p>
            <p className="text-xs md:text-sm text-[#116A3A]">
              Change anything and save again to update it.
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setSavedSignature(cartSignature)}
            className="w-full cursor-pointer text-xs md:text-sm text-[#484848] italic underline hover:text-gray-800 transition-colors mt-2"
          >
            Save my system for later
          </button>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
