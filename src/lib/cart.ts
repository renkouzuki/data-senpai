export function getCart() {
  if (typeof window === "undefined") {
    return { items: [], total: 0 };
  }

  try {
    const cartData = localStorage.getItem("cart");
    if (!cartData) {
      return { items: [], total: 0 };
    }

    return JSON.parse(cartData);
  } catch (error) {
    console.error("Failed to parse cart data from localStorage", error);
    return { items: [], total: 0 };
  }
}

export function addToCart(product, quantity = 1) {
  const cart = getCart();

  // Check if item already exists in cart
  const existingItemIndex = cart.items.findIndex(
    (item) => item.id === product.id
  );

  if (existingItemIndex >= 0) {
    // Update quantity of existing item
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    // Add new item to cart
    cart.items.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity,
    });
  }

  // Recalculate total
  cart.total = cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Save to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Dispatch event to notify other components about cart changes
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cartUpdated"));
  }

  return cart;
}

export function removeFromCart(productId) {
  const cart = getCart();

  // Remove item from cart
  cart.items = cart.items.filter((item) => item.id !== productId);

  // Recalculate total
  cart.total = cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Save to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Dispatch event to notify other components about cart changes
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cartUpdated"));
  }

  return cart;
}

export function updateCartItemQuantity(productId, quantity) {
  const cart = getCart();

  // Find the item
  const item = cart.items.find((item) => item.id === productId);

  if (item) {
    item.quantity = quantity;

    // Recalculate total
    cart.total = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Save to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Dispatch event to notify other components about cart changes
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("cartUpdated"));
    }
  }

  return cart;
}

export function clearCart() {
  // Clear cart
  const emptyCart = { items: [], total: 0 };

  localStorage.setItem("cart", JSON.stringify(emptyCart));

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cartUpdated"));
  }

  return emptyCart;
}
