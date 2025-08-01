// Netlify function for farmers API
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
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(farmers),
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ message: 'Method not allowed' }),
  }
}
