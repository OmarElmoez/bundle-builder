import useBuilderStore from "@/store/useBuilderStore";

const ReviewSection = () => {
  const selections = useBuilderStore((state) => state.selections);
  const getCartDetails = useBuilderStore((state) => state.getCartDetails);
  const getCartTotal = useBuilderStore((state) => state.getCartTotal);
  const updateQuantity = useBuilderStore((state) => state.updateQuantity);

  const cartItems = getCartDetails();

  const cartTotal = getCartTotal();

  return (
    <div className="bg-gray-50 p-6 rounded-xl">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>

      <ul className="space-y-4">
        {cartItems.map((item) => (
          <li
            key={item.key}
            className="flex items-center justify-between py-2 border-b border-gray-200"
          >
            {/* Left Side: Image and Name/Color */}
            <div className="flex items-center gap-3">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-10 h-10 object-contain"
              />
              <div>
                <p className="text-[14px] font-semibold text-gray-900">
                  {item.name}
                </p>
                {item.color && (
                  <p className="text-[12px] text-gray-500">
                    Color: {item.color}
                  </p>
                )}
              </div>
            </div>

            {/* Right Side: Adjusters and Line Subtotal */}
            <div className="flex items-center gap-4">
              {/* Quantity Controls inside the Review panel */}
              <div className="flex items-center gap-2 border border-gray-200 rounded px-1">
                <button
                  onClick={() =>
                    updateQuantity({
                      category: item.category,
                      productId: item.productId,
                      variantColor: item.color,
                      delta: -1,
                    })
                  }
                  className="px-1 text-gray-500"
                >
                  &minus;
                </button>
                <span className="text-[13px] w-4 text-center">
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
                  className="px-1 text-gray-500"
                >
                  &#43;
                </button>
              </div>

              {/* The dynamic price for THIS specific line item */}
              <p className="text-[14px] font-medium min-w-[60px] text-right">
                ${item.lineTotal}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {/* Grand Total Footer */}
      <div className="mt-6 pt-4 flex justify-between items-center">
        <span className="text-lg font-medium text-gray-900">Total Price</span>
        <span className="text-2xl font-bold text-[#4f38d4]">${cartTotal}</span>
      </div>
    </div>
  );
};

export default ReviewSection;
