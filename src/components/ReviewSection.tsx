import React from "react";
import useBuilderStore from "@/store/useBuilderStore";

const ReviewSection = () => {
  // Listen to raw state to ensure instant re-renders
  const selections = useBuilderStore((state) => state.selections);
  void selections;
  const getCartDetails = useBuilderStore((state) => state.getCartDetails);
  const getCartTotal = useBuilderStore((state) => state.getCartTotal);
  const updateQuantity = useBuilderStore((state) => state.updateQuantity);

  const cartItems = getCartDetails();
  const cartTotal = getCartTotal();
  const cartOriginalTotal = Number(
    cartItems
      .reduce(
        (sum, item) =>
          sum + (Number(item.originalPrice ?? item.unitPrice) * item.quantity),
        0,
      )
      .toFixed(2),
  );
  const cartSavings = Number(Math.max(0, cartOriginalTotal - cartTotal).toFixed(2));
  const hasSavings = cartOriginalTotal > cartTotal;
  const formatPrice = (value) => `$${Number(value).toFixed(2)}`;

  const groupedItems = cartItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  if (cartItems.length === 0) {
    return (
      <div className="bg-[#f2f5fa] p-8 rounded-2xl text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Your security system</h2>
        <p className="text-gray-500 text-sm">Your cart is currently empty.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#f2f5fa] p-6 lg:p-8 rounded-2xl flex flex-col lg:flex-row gap-10">
      
      <div className="flex-1">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Your security system
          </h2>
          <p className="text-gray-500 text-[14px]">
            Review your personalized protection system designed to keep what matters most safe.
          </p>
        </header>

        <div className="space-y-6">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
                {category}
              </h3>

              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.key} className="flex items-center justify-between group">
                    
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
                            updateQuantity({
                              category: item.category,
                              productId: item.productId,
                              variantColor: item.color,
                              delta: -1,
                            })
                          }
                          className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors text-lg"
                        >
                          &minus;
                        </button>
                        <span className="text-[14px] font-medium w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity({
                              category: item.category,
                              productId: item.productId,
                              variantColor: item.color,
                              delta: 1,
                            })
                          }
                          className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors text-lg"
                        >
                          &#43;
                        </button>
                      </div>

                      <div className="flex flex-col items-end min-w-[60px]">
                        {item.originalPrice && item.originalPrice > item.unitPrice && (
                          <span className="text-[12px] text-gray-400 line-through leading-none mb-1">
                            ${(item.originalPrice * item.quantity).toFixed(2)}
                          </span>
                        )}
                        <span className="text-[15px] font-bold text-[#4f38d4] leading-none">
                          {item.unitPrice === 0 ? "FREE" : `$${item.lineTotal}`}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              
              <hr className="mt-6 border-gray-200/60" />
            </div>
          ))}
        </div>
      </div>

      <div className="w-full lg:w-[340px] flex flex-col pt-2 lg:pt-16">
        <div className="flex flex-col items-end w-full mb-4">
           <div className="flex justify-between w-full items-end mb-2">
              <span className="bg-[#4f38d4] text-white text-[11px] font-bold px-2 py-1 rounded-full">
                as low as $19.19/mo
              </span>
              <div className="text-right">
                {hasSavings && (
                  <span className="text-sm text-gray-400 line-through mr-2">
                    {formatPrice(cartOriginalTotal)}
                  </span>
                )}
                <span className="text-2xl font-bold text-[#4f38d4]">
                  {formatPrice(cartTotal)}
                </span>
              </div>
           </div>
           {hasSavings && (
             <p className="text-[#00a862] text-[12px] font-medium w-full text-center mt-2">
                Congrats! You're saving {formatPrice(cartSavings)} on your security bundle!
             </p>
           )}
        </div>

        <button className="w-full bg-[#4f38d4] text-white py-3.5 rounded-lg font-bold hover:bg-[#3d2ba8] transition-colors mb-3">
          Checkout
        </button>
        
        <button className="w-full text-[13px] text-gray-500 underline hover:text-gray-800 transition-colors">
          Save my system for later
        </button>
      </div>

    </div>
  );
};

export default ReviewSection;
