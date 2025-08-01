// Shopping cart JavaScript

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || []
  document.getElementById("cart-count").textContent = cart.length
}

function updateAuthLink() {
  const user = JSON.parse(localStorage.getItem("currentUser"))
  const authLink = document.getElementById("auth-link")
  if (user) {
    authLink.textContent = "Logout"
    authLink.href = "/logout.html"
  } else {
    authLink.textContent = "Login"
    authLink.href = "/login.html"
  }
}

function showToast(message, type) {
  const toastContainer = document.getElementById("toast-container")
  const toastElement = document.createElement("div")
  toastElement.className = `toast ${type}`
  toastElement.textContent = message
  toastContainer.appendChild(toastElement)

  setTimeout(() => {
    toastContainer.removeChild(toastElement)
  }, 3000)
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount()
  updateAuthLink()
  loadCartItems()
})

// Load cart items
function loadCartItems() {
  const cart = JSON.parse(localStorage.getItem("cart")) || []
  const cartItemsContainer = document.getElementById("cart-items")

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h4>Your cart is empty</h4>
                <p>Add some fresh products to get started!</p>
                <a href="/products.html" class="btn btn-success">Shop Now</a>
            </div>
        `
    updateOrderSummary(0)
    return
  }

  cartItemsContainer.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
            <div class="row align-items-center">
                <div class="col-md-2">
                    <img src="${item.image}" alt="${item.name}" class="img-fluid rounded">
                </div>
                <div class="col-md-4">
                    <h5>${item.name}</h5>
                    <p class="text-muted mb-0">$${item.price.toFixed(2)} per ${item.unit}</p>
                </div>
                <div class="col-md-3">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="quantity-input" value="${item.quantity}" 
                               onchange="updateQuantity(${item.id}, this.value)" min="1">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="col-md-2">
                    <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
                </div>
                <div class="col-md-1">
                    <button class="btn btn-outline-danger btn-sm" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `,
    )
    .join("")

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  updateOrderSummary(subtotal)
}

// Update quantity
function updateQuantity(productId, newQuantity) {
  if (newQuantity < 1) {
    removeFromCart(productId)
    return
  }

  const cart = JSON.parse(localStorage.getItem("cart")) || []
  const itemIndex = cart.findIndex((item) => item.id === productId)

  if (itemIndex !== -1) {
    cart[itemIndex].quantity = Number.parseInt(newQuantity)
    localStorage.setItem("cart", JSON.stringify(cart))
    loadCartItems()
    updateCartCount()
  }
}

// Remove item from cart
function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || []
  cart = cart.filter((item) => item.id !== productId)
  localStorage.setItem("cart", JSON.stringify(cart))
  loadCartItems()
  updateCartCount()
  showToast("Item removed from cart", "info")
}

// Update order summary
function updateOrderSummary(subtotal) {
  const shipping = subtotal > 0 ? 5.0 : 0
  const total = subtotal + shipping

  document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`
  document.getElementById("shipping").textContent = subtotal > 0 ? `$${shipping.toFixed(2)}` : "Free"
  document.getElementById("total").textContent = `$${total.toFixed(2)}`
}

// Checkout function
function checkout() {
  const cart = JSON.parse(localStorage.getItem("cart")) || []
  const user = JSON.parse(localStorage.getItem("currentUser"))

  if (cart.length === 0) {
    showToast("Your cart is empty", "error")
    return
  }

  if (!user) {
    showToast("Please login to checkout", "error")
    window.location.href = "/login.html"
    return
  }

  // Simulate checkout process
  const orderData = {
    userId: user.id,
    items: cart,
    total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + 5.0,
    timestamp: new Date().toISOString(),
  }

  // Save order to localStorage (in real app, this would go to a database)
  const orders = JSON.parse(localStorage.getItem("orders")) || []
  orders.push({ ...orderData, id: Date.now() })
  localStorage.setItem("orders", JSON.stringify(orders))

  // Clear cart
  localStorage.removeItem("cart")
  updateCartCount()

  showToast("Order placed successfully!", "success")

  setTimeout(() => {
    window.location.href = "/"
  }, 2000)
}
