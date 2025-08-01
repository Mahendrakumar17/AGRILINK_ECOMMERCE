// Products page JavaScript

let allProducts = []
let filteredProducts = []

function updateCartCount() {
  // Placeholder for updateCartCount logic
  console.log("Cart count updated")
}

function updateAuthLink() {
  // Placeholder for updateAuthLink logic
  console.log("Auth link updated")
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount()
  updateAuthLink()
  loadProducts()

  // Add event listeners
  document.getElementById("search").addEventListener("input", applyFilters)
  document.getElementById("category-filter").addEventListener("change", applyFilters)
  document.getElementById("price-filter").addEventListener("change", applyFilters)
  document.getElementById("sort-select").addEventListener("change", sortProducts)
})

// Load all products
async function loadProducts() {
  const productsGrid = document.getElementById("products-grid")
  productsGrid.innerHTML = '<div class="col-12 text-center"><div class="spinner-border" role="status"></div></div>'

  try {
    const response = await fetch("/api/products")
    allProducts = await response.json()
    filteredProducts = [...allProducts]
    displayProducts(filteredProducts)
  } catch (error) {
    console.error("Error loading products:", error)
    productsGrid.innerHTML =
      '<div class="col-12 text-center"><p>Error loading products. Please try again later.</p></div>'
  }
}

// Display products in grid
function displayProducts(products) {
  const productsGrid = document.getElementById("products-grid")

  if (products.length === 0) {
    productsGrid.innerHTML = '<div class="col-12 text-center"><p>No products found matching your criteria.</p></div>'
    return
  }

  productsGrid.innerHTML = products
    .map(
      (product) => `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="card product-card h-100 shadow-sm">
                <img src="${product.image}" class="card-img-top product-image" alt="${product.name}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text text-muted">${product.description}</p>
                    <div class="mb-2">
                        <span class="badge bg-secondary">${product.category}</span>
                        <span class="badge bg-info ms-1">${product.farmer}</span>
                    </div>
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
}

// Apply filters
function applyFilters() {
  const searchTerm = document.getElementById("search").value.toLowerCase()
  const categoryFilter = document.getElementById("category-filter").value
  const priceFilter = document.getElementById("price-filter").value

  filteredProducts = allProducts.filter((product) => {
    // Search filter
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm)

    // Category filter
    const matchesCategory = !categoryFilter || product.category === categoryFilter

    // Price filter
    let matchesPrice = true
    if (priceFilter) {
      const price = product.price
      switch (priceFilter) {
        case "0-5":
          matchesPrice = price <= 5
          break
        case "5-10":
          matchesPrice = price > 5 && price <= 10
          break
        case "10-20":
          matchesPrice = price > 10 && price <= 20
          break
        case "20+":
          matchesPrice = price > 20
          break
      }
    }

    return matchesSearch && matchesCategory && matchesPrice
  })

  sortProducts()
}

// Sort products
function sortProducts() {
  const sortBy = document.getElementById("sort-select").value

  switch (sortBy) {
    case "name":
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
      break
    case "price-low":
      filteredProducts.sort((a, b) => a.price - b.price)
      break
    case "price-high":
      filteredProducts.sort((a, b) => b.price - a.price)
      break
  }

  displayProducts(filteredProducts)
}

// Placeholder function for addToCart
function addToCart(productId) {
  console.log(`Product with ID ${productId} added to cart`)
}
