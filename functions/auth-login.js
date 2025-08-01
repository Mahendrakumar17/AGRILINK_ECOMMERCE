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

    const { email, password } = JSON.parse(event.body)

    // Validate input
    if (!email || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Email and password are required' })
      }
    }

    // Find user with matching email and password
    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ message: 'Invalid credentials' })
      }
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ user: userWithoutPassword })
    }
  } catch (error) {
    console.error('Login error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Internal server error' })
    }
  }
}
