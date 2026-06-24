const API_BASE_URL = "https://69ecc98baf4ff533142b610f.mockapi.io/Stagiaire";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value.trim();
  const remember = document.getElementById("remember").checked;
  const errorList = document.getElementById("errorList");

  errorList.innerHTML = "";

  if (!email || !password) {
    errorList.innerHTML = "<li>❌ Please fill in all fields</li>";
    return;
  }

  try {
    const res = await fetch(API_BASE_URL);
    const users = await res.json();

    const user = users.find(u => u.email === email && u.MotDePasse === password);

    if (!user) {
      errorList.innerHTML = "<li>❌ Invalid email or password</li>";
      return;
    }

    // Store user in session
    sessionStorage.setItem("user", JSON.stringify(user));

    if (remember) {
      localStorage.setItem("rememberedUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("rememberedUser");
    }

    window.location.href = "index.html";

  } catch (error) {
    errorList.innerHTML = "<li>❌ Connection error. Please try again.</li>";
    console.error("Login error:", error);
  }
});

// Auto-fill remembered user
window.addEventListener("DOMContentLoaded", () => {
  const remembered = localStorage.getItem("rememberedUser");
  if (remembered) {
    try {
      const user = JSON.parse(remembered);
      document.getElementById("email").value = user.email || "";
      document.getElementById("password").value = user.MotDePasse || "";
      document.getElementById("remember").checked = true;
    } catch (e) {}
  }
});