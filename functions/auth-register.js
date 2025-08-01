let users = [
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

  // Only allow POST method
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed' })
    }
  }

  try {
    // Parse request body
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Request body is required' })
      }
    }

    const { name, email, password, userType } = JSON.parse(event.body)

    // Validate input
    if (!name || !email || !password || !userType) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'All fields are required' })
      }
    }

    // Check if user already exists
    if (users.find((u) => u.email === email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'User already exists' })
      }
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

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ message: 'User created successfully' })
    }
  } catch (error) {
    console.error('Registration error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Internal server error' })
    }
  }
}
