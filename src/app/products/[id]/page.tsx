import { AddToCartForm } from "@/components/AddToCardForm";
import { Product } from "@/lib/types";
import { fetchData } from "data-senpai";
import Link from "next/link";

export default async function ProductPage({ params }:{params:{id:number}}) {
  const { id } = await params;

  const product : Product = await fetchData(`https://fakestoreapi.com/products/${id}`, {
    cache: "5 minutes",
  });

  return (
    <div>
      <div className="mb-6">
        <Link href="/products" className="text-blue-600 hover:underline">
          &larr; Back to products
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="flex items-center justify-center p-8 bg-white">
            <img
              src={product.image}
              alt={product.title}
              className="max-h-80 object-contain"
            />
          </div>
          <div className="p-8">
            <div className="mb-2 text-sm text-gray-500 uppercase">
              {product.category}
            </div>
            <h1 className="text-2xl font-bold mb-4">{product.title}</h1>
            <div className="flex items-center mb-4">
              <div className="text-yellow-400 flex">
                {"★".repeat(Math.round(product.rating.rate))}
                {"☆".repeat(5 - Math.round(product.rating.rate))}
              </div>
              <span className="ml-2 text-gray-600">
                ({product.rating.count} reviews)
              </span>
            </div>
            <p className="text-3xl font-bold text-blue-600 mb-6">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-gray-700 mb-8">{product.description}</p>

            <AddToCartForm product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
