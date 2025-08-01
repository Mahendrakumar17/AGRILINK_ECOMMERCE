// Netlify function for farmer products API
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
    active: true,
    organic: true,
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
    active: true,
    organic: true,
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
    active: true,
    organic: true,
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
    active: true,
    organic: true,
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
    active: true,
    organic: true,
  },
]

const users = [
  { id: 1, name: "John Customer", email: "customer@example.com", password: "password123", userType: "customer" },
  { id: 2, name: "Jane Farmer", email: "farmer@example.com", password: "password123", userType: "farmer" },
]

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  }

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    }
  }

  if (event.httpMethod === 'GET') {
    try {
      const farmerId = event.queryStringParameters?.farmerId

      if (!farmerId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Farmer ID is required' })
        }
      }

      // Find farmer
      const farmer = users.find((u) => u.id === parseInt(farmerId) && u.userType === 'farmer')
      if (!farmer) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ message: 'Farmer not found' })
        }
      }

      // Get farmer's products
      const farmerProducts = products.filter((p) => p.farmer === farmer.name)

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(farmerProducts)
      }
    } catch (error) {
      console.error('Farmer products error:', error)
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ message: 'Internal server error' })
      }
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ message: 'Method not allowed' })
  }
}
