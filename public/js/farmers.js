// Farmers page JavaScript

function updateCartCount() {
  // Implementation for updateCartCount
  console.log("Cart count updated")
}

function updateAuthLink() {
  // Implementation for updateAuthLink
  console.log("Auth link updated")
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount()
  updateAuthLink()
  loadFarmers()
})

// Load farmers
async function loadFarmers() {
  const farmersGrid = document.getElementById("farmers-grid")
  farmersGrid.innerHTML = '<div class="col-12 text-center"><div class="spinner-border" role="status"></div></div>'

  try {
    const response = await fetch("/api/farmers")
    const farmers = await response.json()

    farmersGrid.innerHTML = farmers
      .map(
        (farmer) => `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="card farmer-card h-100 shadow-sm">
                    <img src="${farmer.image}" class="card-img-top farmer-image" alt="${farmer.name}">
                    <div class="card-body">
                        <h5 class="card-title">${farmer.name}</h5>
                        <p class="card-text">${farmer.description}</p>
                        <div class="mb-3">
                            <small class="text-muted">
                                <i class="fas fa-map-marker-alt me-1"></i>${farmer.location}
                            </small>
                        </div>
                        <div class="mb-3">
                            <strong>Specialties:</strong>
                            <div class="mt-1">
                                ${farmer.specialties
                                  .map((specialty) => `<span class="badge bg-success me-1">${specialty}</span>`)
                                  .join("")}
                            </div>
                        </div>
                        <button class="btn btn-outline-success w-100" onclick="viewFarmerProducts('${farmer.name}')">
                            View Products
                        </button>
                    </div>
                </div>
            </div>
        `,
      )
      .join("")
  } catch (error) {
    console.error("Error loading farmers:", error)
    farmersGrid.innerHTML =
      '<div class="col-12 text-center"><p>Error loading farmers. Please try again later.</p></div>'
  }
}

// View farmer products
function viewFarmerProducts(farmerName) {
  window.location.href = `/products.html?farmer=${encodeURIComponent(farmerName)}`
}
