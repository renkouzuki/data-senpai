"use client";
import { Link } from "data-senpai/client";

export function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-56 p-4 flex items-center justify-center bg-white">
        <img
          src={product.image}
          alt={product.title}
          className="max-h-full object-contain"
        />
      </div>
      <div className="p-4">
        <div className="text-xs text-gray-500 uppercase mb-1">
          {product.category}
        </div>
        <h3 className="text-lg font-medium mb-2 line-clamp-1">
          {product.title}
        </h3>
        <div className="flex items-center mb-2">
          <div className="text-yellow-400 text-sm">
            {"★".repeat(Math.round(product.rating.rate))}
            {"☆".repeat(5 - Math.round(product.rating.rate))}
          </div>
          <span className="ml-1 text-xs text-gray-600">
            ({product.rating.count})
          </span>
        </div>
        <p className="text-blue-600 font-bold mb-4">
          ${product.price.toFixed(2)}
        </p>

        <Link
          href={`/products/${product.id}`}
          prefetch={`https://fakestoreapi.com/products/${product.id}`}
          className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
