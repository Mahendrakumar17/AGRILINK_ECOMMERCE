// Netlify function for products API
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
    let filteredProducts = [...products]

    // Filter by featured
    if (event.queryStringParameters && event.queryStringParameters.featured === 'true') {
      filteredProducts = filteredProducts.filter((p) => p.featured)
    }

    // Filter by category
    if (event.queryStringParameters && event.queryStringParameters.category) {
      filteredProducts = filteredProducts.filter((p) => p.category === event.queryStringParameters.category)
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(filteredProducts),
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ message: 'Method not allowed' }),
  }
}
