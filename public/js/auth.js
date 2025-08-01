// Authentication JavaScript

document.addEventListener("DOMContentLoaded", () => {
  // Check if user is already logged in
  const user = JSON.parse(localStorage.getItem("currentUser"))
  if (user) {
    window.location.href = "/"
    return
  }

  // Add form event listeners
  document.getElementById("login-form").addEventListener("submit", handleLogin)
  document.getElementById("register-form").addEventListener("submit", handleRegister)
})

// Handle login
async function handleLogin(e) {
  e.preventDefault()

  const email = document.getElementById("email").value
  const password = document.getElementById("password").value

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const result = await response.json()

    if (response.ok) {
      localStorage.setItem("currentUser", JSON.stringify(result.user))
      window.alert("Login successful!") // showToast('Login successful!', 'success');
      setTimeout(() => {
        window.location.href = "/"
      }, 1000)
    } else {
      window.alert(result.message || "Login failed") // showToast(result.message || 'Login failed', 'error');
    }
  } catch (error) {
    console.error("Login error:", error)
    window.alert("Login failed. Please try again.") // showToast('Login failed. Please try again.', 'error');
  }
}

// Handle registration
async function handleRegister(e) {
  e.preventDefault()

  const name = document.getElementById("reg-name").value
  const email = document.getElementById("reg-email").value
  const password = document.getElementById("reg-password").value
  const userType = document.getElementById("user-type").value

  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, userType }),
    })

    const result = await response.json()

    if (response.ok) {
      window.alert("Registration successful! Please login.") // showToast('Registration successful! Please login.', 'success');
      showLogin()
      document.getElementById("login-form").reset()
    } else {
      window.alert(result.message || "Registration failed") // showToast(result.message || 'Registration failed', 'error');
    }
  } catch (error) {
    console.error("Registration error:", error)
    window.alert("Registration failed. Please try again.") // showToast('Registration failed. Please try again.', 'error');
  }
}

// Show register form
function showRegister() {
  document.getElementById("register-card").style.display = "block"
  document.querySelector(".card").style.display = "none"
}

// Show login form
function showLogin() {
  document.getElementById("register-card").style.display = "none"
  document.querySelector(".card").style.display = "block"
}

// Declare showToast function
function showToast(message, type) {
  // Implementation of showToast function
  console.log(`Toast: ${message} (${type})`)
}
