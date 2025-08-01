// Main JavaScript file for FarmFresh platform

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount()
  updateAuthLink()
  loadFeaturedProducts()
})

// Update cart count in navigation
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || []
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartCountElement = document.getElementById("cart-count")
  if (cartCountElement) {
    cartCountElement.textContent = totalItems
  }
}

// Update authentication link
function updateAuthLink() {
  const user = JSON.parse(localStorage.getItem("currentUser"))
  const authLink = document.getElementById("auth-link")
  const farmerDashboardNav = document.getElementById("farmer-dashboard-nav")

  if (authLink) {
    if (user) {
      authLink.textContent = `Hello, ${user.name}`
      authLink.href = "#"
      authLink.onclick = logout

      // Show farmer dashboard link if user is a farmer
      if (farmerDashboardNav && user.userType === "farmer") {
        farmerDashboardNav.style.display = "block"
      }
    } else {
      authLink.textContent = "Login"
      authLink.href = "/login.html"
      authLink.onclick = null

      // Hide farmer dashboard link
      if (farmerDashboardNav) {
        farmerDashboardNav.style.display = "none"
      }
    }
  }
}

// Logout function
function logout() {
  localStorage.removeItem("currentUser")
  window.location.href = "/"
}

// Load featured products for home page
async function loadFeaturedProducts() {
  const featuredContainer = document.getElementById("featured-products")
  if (!featuredContainer) return

  try {
    const response = await fetch("/api/products?featured=true&limit=3")
    const products = await response.json()

    featuredContainer.innerHTML = products
      .map(
        (product) => `
            <div class="col-md-4 mb-4">
                <div class="card product-card h-100 shadow-sm">
                    <img src="${product.image}" class="card-img-top product-image" alt="${product.name}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text text-muted">${product.description}</p>
                        <div class="mt-auto">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span class="h5 text-success mb-0">$${product.price.toFixed(2)}</span>
                                <small class="text-muted">per ${product.unit}</small>
                            </div>
                            <button class="btn btn-success w-100" onclick="addToCart(${product.id})">
                                <i class="fas fa-cart-plus me-2"></i>Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `,
      )
      .join("")
  } catch (error) {
    console.error("Error loading featured products:", error)
    featuredContainer.innerHTML =
      '<div class="col-12 text-center"><p>Error loading products. Please try again later.</p></div>'
  }
}

// Add product to cart
async function addToCart(productId) {
  try {
    const response = await fetch(`/api/products/${productId}`)
    const product = await response.json()

    const cart = JSON.parse(localStorage.getItem("cart")) || []
    const existingItem = cart.find((item) => item.id === productId)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        unit: product.unit,
        quantity: 1,
      })
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    updateCartCount()

    // Show success message
    showToast("Product added to cart!", "success")
  } catch (error) {
    console.error("Error adding to cart:", error)
    showToast("Error adding product to cart", "error")
  }
}

// Show toast notification
function showToast(message, type = "info") {
  // Create toast element
  const toast = document.createElement("div")
  toast.className = `alert alert-${type === "success" ? "success" : type === "error" ? "danger" : "info"} position-fixed`
  toast.style.cssText = "top: 100px; right: 20px; z-index: 9999; min-width: 300px;"
  toast.innerHTML = `
        ${message}
        <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
    `

  document.body.appendChild(toast)

  // Auto remove after 3 seconds
  setTimeout(() => {
    if (toast.parentElement) {
      toast.remove()
    }
  }, 3000)
}

// Utility function to format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}
