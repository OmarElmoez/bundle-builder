import data from "@/db.json";
import useBuilderStore from "@/store/useBuilderStore";

const ReviewSection = () => {
  const selections = useBuilderStore((state) => state.selections);
  void selections;

  const getCartDetails = useBuilderStore((state) => state.getCartDetails);
  const getCartTotal = useBuilderStore((state) => state.getCartTotal);
  const updateQuantity = useBuilderStore((state) => state.updateQuantity);

  const cartItems = getCartDetails();
  const cartTotal = getCartTotal();
  const shipping = data.shipping;
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
  const formatPrice = (value) => `$${Number(value).toFixed(2)}`;
  const formatSubscriptionPrice = (value, frequency) =>
    `${formatPrice(value)}/${frequency || "mo"}`;

  const groupedItems = cartItems.reduce((acc, item) => {
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
    <div className="bg-[#EDF4FF] py-8.75 px-15 rounded-[10px] flex flex-col lg:flex-row gap-10 mt-8.5">
      <div>
        <header>
          <h2 className="text-[28px] font-semibold text-[#1F1F1F] mb-1">
            Your security system
          </h2>
          <p className="text-[#1F1F1FBF] text-[16px] font-medium w-[85%] mb-2.5">
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
              <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
                {category}
              </h3>

              <ul className="space-y-3">
                {items.map((item) => (
                  <li
                    key={item.key}
                    className="flex items-center justify-between group gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-white p-2 rounded-xl w-14 h-14 flex items-center justify-center shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div>
                        <p className="text-[15px] font-medium text-gray-900">
                          {item.name}
                        </p>
                        {item.color && (
                          <p className="text-[12px] text-gray-500">
                            Color: {item.color}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3">
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
                        <span className="text-[14px] font-medium w-4 text-center">
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

                      <div className="flex flex-col items-end min-w-[60px]">
                        {((item.isFree && item.unitPrice > 0) ||
                          (item.originalPrice &&
                            item.originalPrice > item.unitPrice)) && (
                          <span className="text-[12px] text-gray-400 line-through leading-none mb-1">
                            {formatPrice(item.unitPrice * item.quantity)}
                          </span>
                        )}
                        <span className="text-[15px] font-bold text-[#4f38d4] leading-none">
                          {item.isFree ? "FREE" : item.unitPrice === 0 ? "FREE" : `$${item.lineTotal}`}
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
              <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
                PLAN
              </h3>

              <div className="space-y-0 rounded-2xl">
                <div className="flex items-center justify-between group gap-4">
                  <div className="flex items-center min-w-0">
                    <div className="w-12 h-12 flex items-center justify-center shrink-0">
                      <img
                        src={planItem.imageUrl}
                        alt={planItem.name}
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[20px] font-bold leading-tight truncate">
                        <span className="text-black">
                          {planItem.name.split(" ")[0]}
                        </span>{" "}
                        <span className="text-[#4E2FD2]">
                          {planItem.name.split(" ").slice(1).join(" ")}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end min-w-[88px]">
                    {planItem.originalPrice &&
                      planItem.originalPrice > planItem.unitPrice && (
                        <span className="text-[13px] text-gray-400 line-through leading-none mb-1">
                          {formatSubscriptionPrice(
                            planItem.originalPrice,
                            planItem.frequency,
                          )}
                        </span>
                      )}
                    <span className="text-[18px] font-semibold text-[#4E2FD2] leading-none">
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
                    <div className="bg-white rounded-xl w-12 h-12 flex items-center justify-center shrink-0 shadow-[0_1px_2px_rgba(15,23,42,0.08)]">
                      <img
                        src={data.shipping.imageUrl}
                        alt={data.shipping.method}
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[16px] font-semibold text-gray-900 leading-tight truncate">
                        {data.shipping.method}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end min-w-[88px]">
                    {shippingIsFree && shippingPrice > 0 && (
                      <span className="text-[13px] text-gray-400 line-through leading-none mb-1">
                        {formatPrice(shippingPrice)}
                      </span>
                    )}
                    <span className="text-[18px] font-semibold text-[#4f38d4] leading-none">
                      {shippingIsFree ? "FREE" : formatPrice(shippingPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="w-full lg:w-[340px] flex flex-col flex-1 pt-2 lg:pt-16">
        <div className="flex flex-col items-end w-full mb-4">
          <div className="flex justify-end w-full items-end mb-2">
            <div className="text-right">
              {hasSavings && (
                <span className="text-sm text-gray-400 line-through mr-2">
                  {formatPrice(totalOriginalPrice)}
                </span>
              )}
              <span className="text-2xl font-bold text-[#4f38d4]">
                {formatPrice(cartTotal)}
              </span>
            </div>
          </div>
          {hasSavings && (
            <p className="text-[#00a862] text-[12px] font-medium w-full text-center mt-2">
              Congrats! You're saving {formatPrice(cartSavings)} on your
              security bundle!
            </p>
          )}
        </div>

        <button className="w-full bg-[#4f38d4] text-white py-3.5 rounded-lg font-bold hover:bg-[#3d2ba8] transition-colors mb-3">
          Checkout
        </button>

        <button className="w-full text-[13px] text-gray-500 underline hover:text-gray-800 transition-colors">
          Save my system for later
        </button>

        <div className="mt-6 flex justify-center">
          <span className="bg-[#4f38d4] text-white text-[11px] font-bold px-2 py-1 rounded-full">
            as low as $19.19/mo
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;
