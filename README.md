# Fetch Me Senapi >///<

<p align="center">
  <img src="https://i.pinimg.com/736x/68/94/87/689487c4ae4e181d804cda76284cd6e0.jpg" alt="fetch-me-senpai Logo" width="200" height="200">
</p>

<p align="center">
  <strong>Simple, Powerful SSR Data Fetching for Next.js</strong>
</p>

<p align="center">
  <a href="#installation"><strong>Installation</strong></a> ·
  <a href="#quick-start"><strong>Quick Start</strong></a> ·
  <a href="#api-reference"><strong>API</strong></a> ·
  <a href="#examples"><strong>Examples</strong></a> ·
  <a href="#typescript"><strong>TypeScript</strong></a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/fetch-me-senpai" target="_blank">
    <img src="https://img.shields.io/npm/v/next-fetch.svg" alt="npm version">
  </a>
  <a href="https://github.com/yourusername/next-fetch/blob/main/LICENSE" target="_blank">
    <img src="https://img.shields.io/npm/l/next-fetch.svg" alt="License">
  </a>
  <img src="https://img.shields.io/bundlephobia/minzip/next-fetch" alt="Bundle Size">
</p>

---

**Fetch-me-senpai** is a lightweight, intuitive data fetching library for Next.js applications that simplifies server-side rendering while providing powerful client-side capabilities. It's designed with developer experience in mind, making data fetching easy for beginners and powerful for advanced users.

## Features

- 🚀 **Server-First Approach**: Optimized for Next.js Server Components
- 💪 **SSR + CSR**: Seamless transition from server to client
- 🕒 **Simple Caching**: Human-readable cache times like "1 hour" or "5 minutes"
- 🔄 **Smart Revalidation**: Automatic and manual data refreshing
- ⚡ **Preloading**: Intuitive data preloading for faster page transitions
- 🛠️ **Developer Experience**: Clean API with TypeScript support
- 🧩 **Ready-Made Components**: Easy loading states and error handling

## Installation

```bash
# npm
npm install next-fetch

# yarn
yarn add next-fetch

# pnpm
pnpm add next-fetch
```

## Quick Start

### Server Component Example

```tsx
// app/products/page.tsx
import { fetchData } from 'next-fetch';
import ProductList from '@/components/ProductList';

export default async function ProductsPage() {
  // Fetch with simple cache definition
  const products = await fetchData('/api/products', {
    cache: '1 hour'
  });
  
  return (
    <div className="container">
      <h1>Our Products</h1>
      <ProductList products={products} />
    </div>
  );
}
```

### Client Component Example

```tsx
// components/CartWidget.tsx
import { useServerData } from 'next-fetch';

export default function CartWidget() {
  // Data initially from server, refreshable on client
  const { data: cart, refresh, isLoading } = useServerData('/api/cart');
  
  return (
    <div className="cart-widget">
      {isLoading ? (
        <span>Loading cart...</span>
      ) : (
        <>
          <span>{cart.items.length} items (${cart.total})</span>
          <button onClick={refresh}>Refresh</button>
        </>
      )}
    </div>
  );
}
```

### Form Submission Example

```tsx
// components/AddToCartForm.tsx
import { useSubmit } from 'next-fetch';

export default function AddToCartForm({ productId }) {
  // Form submission with auto-refresh
  const { submit, isSubmitting } = useSubmit('/api/cart/add', {
    method: 'POST',
    refreshData: ['/api/cart']  // Auto-refresh cart data
  });
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      submit({ 
        productId,
        quantity: parseInt(e.target.quantity.value)
      });
    }}>
      <input name="quantity" type="number" defaultValue="1" min="1" />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Adding...' : 'Add to Cart'}
      </button>
    </form>
  );
}
```

## Core Concepts

### Human-Readable Cache Times

Fetch-me-senpai uses plain English for cache durations:

```tsx
// Cache for 5 minutes
await fetchData('/api/weather', { cache: '5 minutes' });

// Cache for 1 hour (default when true is provided)
await fetchData('/api/products', { cache: true });

// No caching
await fetchData('/api/user/profile', { cache: false });
```

### Server-First, Client-Enhanced

Data is fetched on the server when possible, then handed off to the client for updates:

```tsx
// Server component fetches initial data
const initialData = await fetchData('/api/data');

// Client component can refresh the data
function ClientComponent({ initialData }) {
  const { data, refresh } = useServerData('/api/data');
  // data initially equals initialData, can be refreshed
}
```

### Preloading for Performance

Preload data to make navigation feel instant:

```tsx
import { Link } from 'next-fetch';

function ProductCard({ product }) {
  return (
    <Link 
      href={`/products/${product.id}`}
      prefetch={`/api/products/${product.id}`}
    >
      View Details
    </Link>
  );
}
```

## API Reference

### Core Functions

#### `fetchData(url, options)`

Fetches data with caching support.

```tsx
const data = await fetchData(url, {
  cache: '1 hour',  // Cache duration in plain English
  method: 'GET',    // HTTP method
  headers: {},      // Custom headers
  body: {}          // Request body (for POST, PUT, etc.)
});
```

#### `useServerData(url, options)`

React hook for client-side data with server-first approach.

```tsx
const { 
  data,        // The fetched data
  error,       // Error object if request failed
  isLoading,   // Loading state
  refresh      // Function to refresh data
} = useServerData('/api/data');
```

#### `useSubmit(url, options)`

React hook for form submissions with data refresh.

```tsx
const {
  submit,        // Function to submit data
  isSubmitting,  // Whether submission is in progress
  error,         // Error object if submission failed
  data           // Response data from successful submission
} = useSubmit('/api/submit', {
  method: 'POST',
  refreshData: ['/api/related-data'],
  onSuccess: (data) => console.log('Success!', data),
  onError: (error) => console.error('Error!', error)
});
```

#### `preloadData(url, options)`

Manually preload data for future use.

```tsx
// Preload product data when user hovers over category
function CategoryItem({ category }) {
  return (
    <div 
      onMouseEnter={() => preloadData(`/api/categories/${category.id}/products`)}
    >
      {category.name}
    </div>
  );
}
```

#### `invalidateData(url)`

Manually invalidate cached data.

```tsx
// Clear cache after user updates profile
async function updateProfile(data) {
  await fetch('/api/user/profile', {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  
  // Invalidate cached profile data
  invalidateData('/api/user/profile');
}
```

### Components

#### `<LoadingFallback />`

Component for handling loading states elegantly.

```tsx
<LoadingFallback 
  fetch="/api/posts"
  options={{ cache: '10 minutes' }}
  fallback={<div>Loading posts...</div>}
>
  {(posts) => (
    <div className="posts-grid">
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )}
</LoadingFallback>
```

#### `<ErrorBoundary />`

Component for graceful error handling.

```tsx
<ErrorBoundary 
  fallback={(error) => (
    <div className="error-container">
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <button onClick={() => window.location.reload()}>
        Try Again
      </button>
    </div>
  )}
>
  <UserDashboard />
</ErrorBoundary>
```

#### `<Link />`

Enhanced link component with data preloading.

```tsx
<Link 
  href="/products/123"
  prefetch="/api/products/123"
  className="product-link"
>
  View Product Details
</Link>
```

## Examples

### Data-Dependent Components

```tsx
import { LoadingFallback } from 'next-fetch';

function UserOrders() {
  return (
    <div className="orders-section">
      <h2>Your Orders</h2>
      
      <LoadingFallback 
        fetch="/api/user/orders"
        fallback={<OrdersSkeleton />}
      >
        {(orders) => (
          orders.length > 0 ? (
            <OrdersList orders={orders} />
          ) : (
            <EmptyOrders />
          )
        )}
      </LoadingFallback>
    </div>
  );
}
```

### Multi-Step Form Submission

```tsx
import { useSubmit } from 'next-fetch';

function CheckoutForm() {
  const [step, setStep] = useState(1);
  
  const { submit, isSubmitting } = useSubmit('/api/checkout', {
    onSuccess: () => {
      // Redirect to confirmation page
      window.location.href = '/checkout/confirmation';
    }
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    submit({
      // Convert FormData to object
      ...Object.fromEntries(formData.entries())
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {step === 1 && <ShippingForm />}
      {step === 2 && <PaymentForm />}
      {step === 3 && <ReviewOrder />}
      
      <div className="form-controls">
        {step > 1 && (
          <button type="button" onClick={() => setStep(step - 1)}>
            Back
          </button>
        )}
        
        {step < 3 ? (
          <button type="button" onClick={() => setStep(step + 1)}>
            Continue
          </button>
        ) : (
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : 'Place Order'}
          </button>
        )}
      </div>
    </form>
  );
}
```

## TypeScript

Fetch-me-senpai is built with TypeScript and provides full type safety:

```tsx
// Define your data types
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

// Use with fetchData
const products = await fetchData<Product[]>('/api/products');
// products is typed as Product[]

// Use with useServerData
const { data } = useServerData<Product[]>('/api/products');
// data is typed as Product[]

// Use with LoadingFallback
<LoadingFallback<Product[]> fetch="/api/products">
  {(products) => {
    // products is typed as Product[]
    return <ProductList products={products} />;
  }}
</LoadingFallback>
```

## Best Practices

### Optimize Cache Times

Set appropriate cache times based on how frequently your data changes:

```tsx
// Frequently changing data
await fetchData('/api/stock-prices', { cache: '30 seconds' });

// Semi-stable data
await fetchData('/api/products', { cache: '1 hour' });

// Very stable data
await fetchData('/api/categories', { cache: '1 day' });
```

### Use Error Boundaries Strategically

Wrap specific components instead of entire pages for better user experience:

```tsx
<div className="dashboard">
  <UserInfo userId={userId} /> {/* Critical component */}
  
  <ErrorBoundary fallback={(e) => <p>Could not load activity</p>}>
    <RecentActivity userId={userId} /> {/* Non-critical component */}
  </ErrorBoundary>
  
  <ErrorBoundary fallback={(e) => <p>Could not load recommendations</p>}>
    <Recommendations userId={userId} /> {/* Non-critical component */}
  </ErrorBoundary>
</div>
```

### Preload on Intent

Preload data when the user shows intent to navigate:

```tsx
function NavigationMenu() {
  return (
    <ul className="nav-menu">
      <li 
        onMouseEnter={() => preloadData('/api/dashboard-data')}
      >
        <Link href="/dashboard">Dashboard</Link>
      </li>
      <li 
        onMouseEnter={() => preloadData('/api/products')}
      >
        <Link href="/products">Products</Link>
      </li>
    </ul>
  );
}
```

## Contributing

We welcome contributions! Please see our [contributing guide](CONTRIBUTING.md) for details.

### Development

```bash
# Clone the repository
git clone https://github.com/yourusername/next-fetch.git
cd next-fetch

# Install dependencies
npm install

# Start development mode
npm run dev

# Run tests
npm test
```

## License

[MIT](LICENSE)

---

<p align="center">
  Made with ❤️ for Next.js developers
</p>