import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/lib/types";
import { fetchData } from "data-senpai";
import Link from "next/link";

export default async function Home() {
  const products : Product[] = await fetchData(
    "https://fakestoreapi.com/products?limit=6",
    {
      cache: "10 minutes",
    }
  );

  return (
    <div>
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to NextFetch Demo Store
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Browse our collection of products with lightning-fast data loading
          powered by NextFetch.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/products"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
          >
            View All Products
          </Link>
        </div>
      </section>
    </div>
  );
}
