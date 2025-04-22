"use client"
import { useEffect, useState } from "react";
import { getCart } from "@/lib/cart";

export function CartWidget() {
  const [cart, setCart] = useState({ items: [], total: 0 });

  useEffect(() => {
    const storedCart = getCart();
    setCart(storedCart);

    const handleStorageChange = () => {
      const updatedCart = getCart();
      setCart(updatedCart);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cartUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleStorageChange);
    };
  }, []);

  const itemCount = cart.items.reduce(
    (count, item) => count + item.quantity,
    0
  );

  return (
    <div className="relative">
      <button
        className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        onClick={() => {
          alert(
            `Your cart has ${itemCount} items with a total of $${cart.total.toFixed(
              2
            )}`
          );
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <span>Cart</span>
        {itemCount > 0 && (
          <span className="ml-1 bg-white text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
            {itemCount}
          </span>
        )}
      </button>
    </div>
  );
}
