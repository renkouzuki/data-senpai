"use client"
import { useState } from "react";
import { addToCart } from "@/lib/cart";

export function AddToCartForm({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsAdding(true);

    setTimeout(() => {
      addToCart(product, quantity);
      setMessage("Added to cart!");
      setIsAdding(false);

      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center mb-4">
        <label htmlFor="quantity" className="mr-4 font-medium">
          Quantity:
        </label>
        <div className="flex border rounded overflow-hidden">
          <button
            type="button"
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            -
          </button>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="w-16 text-center border-0"
          />
          <button
            type="button"
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
            onClick={() => setQuantity(quantity + 1)}
          >
            +
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
        disabled={isAdding}
      >
        {isAdding ? "Adding to Cart..." : "Add to Cart"}
      </button>

      {message && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded text-center">
          {message}
        </div>
      )}
    </form>
  );
}
