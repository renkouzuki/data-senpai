import Link from "next/link";
import { CartWidget } from "./CartWidget";

export function Navbar() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              NextFetch Demo
            </Link>
            <nav className="hidden md:flex ml-10 space-x-8">
              <Link
                href="/"
                className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium"
              >
                Products
              </Link>
            </nav>
          </div>
          <CartWidget />
        </div>
      </div>
    </header>
  );
}
