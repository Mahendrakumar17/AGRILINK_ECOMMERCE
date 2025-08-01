// Farmer Dashboard JavaScript

let currentFarmer = null
const bootstrap = window.bootstrap // Declare the bootstrap variable

document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in and is a farmer
  const user = JSON.parse(localStorage.getItem("currentUser"))

  if (!user || user.userType !== "farmer") {
    alert("Access denied. Please login as a farmer.")
    window.location.href = "/login.html"
    return
  }

  currentFarmer = user
  document.getElementById("farmer-name").textContent = user.name

  updateCartCount()
  loadFarmerProducts()
  updateDashboardStats()
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

// Logout function
function logout() {
  localStorage.removeItem("currentUser")
  window.location.href = "/"
}

// Load farmer's products
async function loadFarmerProducts() {
  try {
    const response = await fetch(`/api/farmer/products?farmerId=${currentFarmer.id}`)
    const products = await response.json()

    displayFarmerProducts(products)
    updateDashboardStats(products)
  } catch (error) {
    console.error("Error loading farmer products:", error)
    showToast("Error loading products", "error")
  }
}

// Display farmer's products in table
function displayFarmerProducts(products) {
  const tableBody = document.getElementById("products-table-body")

  if (products.length === 0) {
    tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-4">
                    <i class="fas fa-seedling fa-3x text-muted mb-3"></i>
                    <p class="text-muted">No products found. Add your first product to get started!</p>
                </td>
            </tr>
        `
    return
  }

  tableBody.innerHTML = products
    .map(
      (product) => `
        <tr>
            <td>
                <img src="${product.image}" alt="${product.name}" 
                     class="img-thumbnail" style="width: 50px; height: 50px; object-fit: cover;">
            </td>
            <td>
                <strong>${product.name}</strong>
                ${product.featured ? '<span class="badge bg-warning ms-1">Featured</span>' : ""}
                ${product.organic ? '<span class="badge bg-success ms-1">Organic</span>' : ""}
            </td>
            <td><span class="badge bg-secondary">${product.category}</span></td>
            <td><strong>$${product.price.toFixed(2)}</strong></td>
            <td>${product.unit}</td>
            <td>
                <span class="badge ${product.active ? "bg-success" : "bg-danger"}">
                    ${product.active ? "Active" : "Inactive"}
                </span>
            </td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" onclick="editProduct(${product.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-outline-${product.active ? "warning" : "success"}" 
                            onclick="toggleProductStatus(${product.id})" 
                            title="${product.active ? "Deactivate" : "Activate"}">
                        <i class="fas fa-${product.active ? "eye-slash" : "eye"}"></i>
                    </button>
                    <button class="btn btn-outline-danger" onclick="deleteProduct(${product.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `,
    )
    .join("")
}

// Update dashboard statistics
function updateDashboardStats(products = []) {
  const totalProducts = products.length
  const activeProducts = products.filter((p) => p.active).length

  document.getElementById("total-products").textContent = totalProducts
  document.getElementById("active-products").textContent = activeProducts

  // Mock data for orders and revenue (in a real app, this would come from the backend)
  document.getElementById("total-orders").textContent = Math.floor(Math.random() * 50) + 10
  document.getElementById("total-revenue").textContent = "$" + (Math.random() * 5000 + 1000).toFixed(2)
}

// Add new product
async function addProduct() {
  const form = document.getElementById("add-product-form")

  if (!form.checkValidity()) {
    form.reportValidity()
    return
  }

  const productData = {
    name: document.getElementById("product-name").value,
    category: document.getElementById("product-category").value,
    price: Number.parseFloat(document.getElementById("product-price").value),
    unit: document.getElementById("product-unit").value,
    description: document.getElementById("product-description").value,
    image:
      document.getElementById("product-image").value ||
      getDefaultImage(document.getElementById("product-category").value),
    featured: document.getElementById("product-featured").checked,
    organic: document.getElementById("product-organic").checked,
    farmerId: currentFarmer.id,
    farmer: currentFarmer.name,
  }

  try {
    const response = await fetch("/api/farmer/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    })

    const result = await response.json()

    if (response.ok) {
      showToast("Product added successfully!", "success")
      form.reset()
      bootstrap.Modal.getInstance(document.getElementById("addProductModal")).hide()
      loadFarmerProducts()
    } else {
      showToast(result.message || "Error adding product", "error")
    }
  } catch (error) {
    console.error("Error adding product:", error)
    showToast("Error adding product", "error")
  }
}

// Edit product
async function editProduct(productId) {
  try {
    const response = await fetch(`/api/products/${productId}`)
    const product = await response.json()

    // Populate edit form
    document.getElementById("edit-product-id").value = product.id
    document.getElementById("edit-product-name").value = product.name
    document.getElementById("edit-product-category").value = product.category
    document.getElementById("edit-product-price").value = product.price
    document.getElementById("edit-product-unit").value = product.unit
    document.getElementById("edit-product-description").value = product.description
    document.getElementById("edit-product-image").value = product.image
    document.getElementById("edit-product-featured").checked = product.featured || false
    document.getElementById("edit-product-organic").checked = product.organic || false

    // Show modal
    new bootstrap.Modal(document.getElementById("editProductModal")).show()
  } catch (error) {
    console.error("Error loading product for edit:", error)
    showToast("Error loading product", "error")
  }
}

// Update product
async function updateProduct() {
  const form = document.getElementById("edit-product-form")

  if (!form.checkValidity()) {
    form.reportValidity()
    return
  }

  const productId = document.getElementById("edit-product-id").value
  const productData = {
    name: document.getElementById("edit-product-name").value,
    category: document.getElementById("edit-product-category").value,
    price: Number.parseFloat(document.getElementById("edit-product-price").value),
    unit: document.getElementById("edit-product-unit").value,
    description: document.getElementById("edit-product-description").value,
    image: document.getElementById("edit-product-image").value,
    featured: document.getElementById("edit-product-featured").checked,
    organic: document.getElementById("edit-product-organic").checked,
  }

  try {
    const response = await fetch(`/api/farmer/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    })

    const result = await response.json()

    if (response.ok) {
      showToast("Product updated successfully!", "success")
      bootstrap.Modal.getInstance(document.getElementById("editProductModal")).hide()
      loadFarmerProducts()
    } else {
      showToast(result.message || "Error updating product", "error")
    }
  } catch (error) {
    console.error("Error updating product:", error)
    showToast("Error updating product", "error")
  }
}

// Toggle product status (active/inactive)
async function toggleProductStatus(productId) {
  try {
    const response = await fetch(`/api/farmer/products/${productId}/toggle`, {
      method: "PATCH",
    })

    const result = await response.json()

    if (response.ok) {
      showToast(`Product ${result.active ? "activated" : "deactivated"} successfully!`, "success")
      loadFarmerProducts()
    } else {
      showToast(result.message || "Error updating product status", "error")
    }
  } catch (error) {
    console.error("Error toggling product status:", error)
    showToast("Error updating product status", "error")
  }
}

// Delete product
async function deleteProduct(productId) {
  if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
    return
  }

  try {
    const response = await fetch(`/api/farmer/products/${productId}`, {
      method: "DELETE",
    })

    const result = await response.json()

    if (response.ok) {
      showToast("Product deleted successfully!", "success")
      loadFarmerProducts()
    } else {
      showToast(result.message || "Error deleting product", "error")
    }
  } catch (error) {
    console.error("Error deleting product:", error)
    showToast("Error deleting product", "error")
  }
}

// Refresh products
function refreshProducts() {
  loadFarmerProducts()
  showToast("Products refreshed!", "info")
}

// Get default image based on category
function getDefaultImage(category) {
  const defaultImages = {
    vegetables: "/images/edunet/vegetable products.jpg",
    fruits: "/images/edunet/fruits produtcs.jpg",
    herbs: "/images/edunet/herb products.jpg",
    grains: "/images/edunet/grain products.png",
    dairy: "/images/edunet/diary products.jpg",
    other: "/images/edunet/generic placeholder.jpg",
  }

  return defaultImages[category] || defaultImages.other
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
