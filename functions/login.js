const users = [
  { id: 1, name: "John Customer", email: "customer@example.com", password: "password123", userType: "customer" },
  { id: 2, name: "Jane Farmer", email: "farmer@example.com", password: "password123", userType: "farmer" },
]

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ message: 'Method not allowed' }) }
  }

  try {
    const { email, password } = JSON.parse(event.body || '{}')
    
    if (!email || !password) {
      return { statusCode: 400, headers, body: JSON.stringify({ message: 'Email and password required' }) }
    }

    const user = users.find((u) => u.email === email && u.password === password)
    
    if (!user) {
      return { statusCode: 401, headers, body: JSON.stringify({ message: 'Invalid credentials' }) }
    }

    const { password: _, ...userWithoutPassword } = user
    return { statusCode: 200, headers, body: JSON.stringify({ user: userWithoutPassword }) }
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ message: 'Server error' }) }
  }
}
