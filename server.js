const express = require("express")
const path = require("path")
const fs = require("fs").promises

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())
app.use(express.static("public"))

// In-memory data storage (in production, use a real database)
const users = [
  { id: 1, name: "John Customer", email: "customer@example.com", password: "password123", userType: "customer" },
  { id: 2, name: "Jane Farmer", email: "farmer@example.com", password: "password123", userType: "farmer" },
]

const products = [
  {
    id: 1,
    name: "Organic Tomatoes",
    description: "Fresh, juicy organic tomatoes grown without pesticides",
    price: 4.99,
    unit: "lb",
    category: "vegetables",
    farmer: "Green Valley Farm",
    image: "/images/edunet/vegetable products.jpg",
    featured: true,
  },
  {
    id: 2,
    name: "Fresh Spinach",
    description: "Crisp, nutrient-rich spinach leaves perfect for salads",
    price: 3.49,
    unit: "bunch",
    category: "vegetables",
    farmer: "Sunny Acres",
    image: "/images/edunet/vegetable products.jpg",
    featured: true,
  },
  {
    id: 3,
    name: "Sweet Corn",
    description: "Sweet, tender corn on the cob, harvested daily",
    price: 0.75,
    unit: "ear",
    category: "vegetables",
    farmer: "Meadow Farm",
    image: "/images/edunet/vegetable products.jpg",
    featured: true,
  },
  {
    id: 4,
    name: "Organic Apples",
    description: "Crisp, sweet organic apples from local orchards",
    price: 5.99,
    unit: "lb",
    category: "fruits",
    farmer: "Orchard Hills",
    image: "/images/edunet/fruits produtcs.jpg",
    featured: false,
  },
  {
    id: 5,
    name: "Fresh Basil",
    description: "Aromatic fresh basil perfect for cooking",
    price: 2.99,
    unit: "bunch",
    category: "herbs",
    farmer: "Herb Garden Co",
    image: "/images/edunet/herb products.jpg",
    featured: false,
  },
  {
    id: 6,
    name: "Organic Carrots",
    description: "Sweet, crunchy organic carrots with tops",
    price: 3.99,
    unit: "lb",
    category: "vegetables",
    farmer: "Root & Stem Farm",
    image: "/images/edunet/vegetable products.jpg",
    featured: false,
  },
  {
    id: 7,
    name: "Fresh Strawberries",
    description: "Sweet, juicy strawberries picked at peak ripeness",
    price: 6.99,
    unit: "pint",
    category: "fruits",
    farmer: "Berry Patch Farm",
    image: "/images/edunet/fruits produtcs.jpg",
    featured: false,
  },
  {
    id: 8,
    name: "Organic Lettuce",
    description: "Crisp, fresh lettuce heads perfect for salads",
    price: 2.49,
    unit: "head",
    category: "vegetables",
    farmer: "Green Valley Farm",
    image: "/images/edunet/vegetable products.jpg",
    featured: false,
  },
]

const farmers = [
  {
    id: 1,
    name: "Green Valley Farm",
    description:
      "Family-owned organic farm specializing in vegetables and herbs. We have been serving the community for over 20 years with sustainable farming practices.",
    location: "Valley Springs, CA",
    specialties: ["Organic Vegetables", "Herbs", "Sustainable Farming"],
    image: "/images/edunet/farmer profile.jpg",
  },
  {
    id: 2,
    name: "Sunny Acres",
    description:
      "Small family farm focused on leafy greens and seasonal vegetables. We use traditional farming methods passed down through generations.",
    location: "Riverside, CA",
    specialties: ["Leafy Greens", "Seasonal Vegetables", "Traditional Methods"],
    image: "/images/edunet/farmer profile.jpg",
  },
  {
    id: 3,
    name: "Meadow Farm",
    description:
      "Specializing in corn, squash, and pumpkins. Our farm spans 50 acres of fertile meadowland perfect for growing quality produce.",
    location: "Meadowbrook, CA",
    specialties: ["Corn", "Squash", "Pumpkins"],
    image: "/images/edunet/farmer profile.jpg",
  },
  {
    id: 4,
    name: "Orchard Hills",
    description:
      "Premium fruit orchard with apple, pear, and stone fruit trees. We practice integrated pest management and sustainable growing.",
    location: "Hill Country, CA",
    specialties: ["Apples", "Pears", "Stone Fruits"],
    image: "/images/edunet/farmer profile.jpg",
  },
  {
    id: 5,
    name: "Berry Patch Farm",
    description:
      "Boutique berry farm growing strawberries, blueberries, and raspberries. We focus on flavor and quality over quantity.",
    location: "Coastal Valley, CA",
    specialties: ["Strawberries", "Blueberries", "Raspberries"],
    image: "/images/edunet/farmer profile.jpg",
  },
  {
    id: 6,
    name: "Root & Stem Farm",
    description:
      "Specializing in root vegetables and underground crops. Our rich soil produces the most flavorful carrots, potatoes, and beets.",
    location: "Fertile Plains, CA",
    specialties: ["Root Vegetables", "Potatoes", "Underground Crops"],
    image: "/images/edunet/farmer profile.jpg",
  },
]

// API Routes

// Get all products
app.get("/api/products", (req, res) => {
  let filteredProducts = [...products]

  // Filter by featured
  if (req.query.featured === "true") {
    filteredProducts = filteredProducts.filter((p) => p.featured)
  }

  // Filter by farmer
  if (req.query.farmer) {
    filteredProducts = filteredProducts.filter((p) => p.farmer === req.query.farmer)
  }

  // Limit results
  if (req.query.limit) {
    filteredProducts = filteredProducts.slice(0, Number.parseInt(req.query.limit))
  }

  res.json(filteredProducts)
})

// Get single product
app.get("/api/products/:id", (req, res) => {
  const product = products.find((p) => p.id === Number.parseInt(req.params.id))
  if (!product) {
    return res.status(404).json({ message: "Product not found" })
  }
  res.json(product)
})

// Get all farmers
app.get("/api/farmers", (req, res) => {
  res.json(farmers)
})

// Authentication routes
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body

  const user = users.find((u) => u.email === email && u.password === password)
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" })
  }

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user
  res.json({ user: userWithoutPassword })
})

app.post("/api/auth/register", (req, res) => {
  const { name, email, password, userType } = req.body

  // Check if user already exists
  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ message: "User already exists" })
  }

  // Create new user
  const newUser = {
    id: users.length + 1,
    name,
    email,
    password,
    userType,
  }

  users.push(newUser)

  res.status(201).json({ message: "User created successfully" })
})

// Add farmer-specific API routes after the existing API routes:

// Farmer-specific routes

// Get products by farmer
app.get("/api/farmer/products", (req, res) => {
  const farmerId = Number.parseInt(req.query.farmerId)

  if (!farmerId) {
    return res.status(400).json({ message: "Farmer ID is required" })
  }

  // In a real app, you'd get the farmer name from the database
  const farmer = users.find((u) => u.id === farmerId && u.userType === "farmer")
  if (!farmer) {
    return res.status(404).json({ message: "Farmer not found" })
  }

  const farmerProducts = products.filter((p) => p.farmer === farmer.name)

  // Add active status and other farmer-specific fields
  const productsWithStatus = farmerProducts.map((p) => ({
    ...p,
    active: p.active !== false, // Default to true if not set
    organic: p.organic !== false, // Default to true if not set
    farmerId: farmerId,
  }))

  res.json(productsWithStatus)
})

// Add new product
app.post("/api/farmer/products", (req, res) => {
  const productData = req.body

  // Generate new ID
  const newId = Math.max(...products.map((p) => p.id)) + 1

  const newProduct = {
    id: newId,
    name: productData.name,
    description: productData.description,
    price: productData.price,
    unit: productData.unit,
    category: productData.category,
    farmer: productData.farmer,
    image: productData.image,
    featured: productData.featured || false,
    organic: productData.organic || false,
    active: true,
    farmerId: productData.farmerId,
  }

  products.push(newProduct)

  res.status(201).json({ message: "Product added successfully", product: newProduct })
})

// Update product
app.put("/api/farmer/products/:id", (req, res) => {
  const productId = Number.parseInt(req.params.id)
  const productIndex = products.findIndex((p) => p.id === productId)

  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found" })
  }

  const updatedProduct = {
    ...products[productIndex],
    ...req.body,
  }

  products[productIndex] = updatedProduct

  res.json({ message: "Product updated successfully", product: updatedProduct })
})

// Toggle product status
app.patch("/api/farmer/products/:id/toggle", (req, res) => {
  const productId = Number.parseInt(req.params.id)
  const productIndex = products.findIndex((p) => p.id === productId)

  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found" })
  }

  products[productIndex].active = !products[productIndex].active

  res.json({
    message: "Product status updated successfully",
    active: products[productIndex].active,
  })
})

// Delete product
app.delete("/api/farmer/products/:id", (req, res) => {
  const productId = Number.parseInt(req.params.id)
  const productIndex = products.findIndex((p) => p.id === productId)

  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found" })
  }

  products.splice(productIndex, 1)

  res.json({ message: "Product deleted successfully" })
})

// Serve HTML files
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.get("/products.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "products.html"))
})

app.get("/cart.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "cart.html"))
})

app.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"))
})

app.get("/farmers.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "farmers.html"))
})

// Add the farmer dashboard route
app.get("/farmer-dashboard.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "farmer-dashboard.html"))
})

// Start server
app.listen(PORT, () => {
  console.log(`FarmFresh server running on http://localhost:${PORT}`)
})

module.exports = app
