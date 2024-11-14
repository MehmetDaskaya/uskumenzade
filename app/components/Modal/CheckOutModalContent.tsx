// src/components/CheckoutModalContent.tsx

export default function CheckoutModalContent() {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-center text-gray-800">
        Ödeme
      </h2>
      <p className="text-sm text-center text-gray-600 mt-2 mb-6">
        Aşağıdan Ödemenizi Tamamlayın
      </p>

      <form className="space-y-4">
        {/* Discount Field */}
        <div>
          <label htmlFor="discount" className="text-sm text-gray-700">
            İndirim Kodu
          </label>
          <input
            id="discount"
            type="text"
            className="w-full p-3 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-yellow-500"
            placeholder="İndirim Kodu Girin"
          />
        </div>

        {/* Checkout Items Placeholder */}
        <div className="space-y-2">
          <div className="flex justify-between text-gray-700">
            <span>Product 1</span>
            <span>100 ₺</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Product 2</span>
            <span>200 ₺</span>
          </div>
          {/* Add more items as necessary */}
        </div>

        {/* Checkout Button */}
        <button
          type="submit"
          className="w-full p-3 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Ödeme Adımına İlerle
        </button>
      </form>

      {/* Link to Cart */}
      <div className="text-center mt-6">
        <a href="/sepet" className="text-yellow-500 hover:underline">
          Sepete git
        </a>
      </div>
    </div>
  );
}
