"use client";
import React from "react";
import { ProductCard } from "./ProductCard";
import { Product } from "@/lib/types";
import { ErrorBoundary } from "data-senpai/client";

const Products = ({ products }: { products: Product[] }) => {
  return (
    <ErrorBoundary
      fallback={(error) => (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-medium">Failed to load products</h3>
          <p>{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
          >
            Try Again
          </button>
        </div>
      )}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </ErrorBoundary>
  );
};

export default Products;
