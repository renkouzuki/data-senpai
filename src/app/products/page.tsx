import Products from "@/components/Products";
import { Product } from "@/lib/types";
import { fetchData } from "data-senpai";
import Link from "next/link";

export default async function ProductsPage() {
  const products : Product[] = await fetchData("https://fakestoreapi.com/products", {
    cache: "5 minutes",
  });

  const categories: string[] = await fetchData(
    "https://fakestoreapi.com/products/categories",
    {
      cache: "1 day",
    }
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">All Products</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-medium mb-4">Categories</h2>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products"
                  className="block px-3 py-2 rounded hover:bg-gray-100 font-medium text-blue-600"
                >
                  All Categories
                </Link>
              </li>
              {categories.map((category) => (
                <li key={category}>
                  <a
                    href={`/products?category=${category}`}
                    className="block px-3 py-2 rounded hover:bg-gray-100"
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex-1">
          <Products products={products}/>
        </div>
      </div>
    </div>
  );
}
