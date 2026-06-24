const registerForm = document.getElementById("registerForm");

function setError(id, message) {
  document.getElementById(id).innerHTML = message;
}

function clearErrors() {
  setError("nomError", "");
  setError("ageError", "");
  setError("pseudoError", "");
  setError("emailError", "");
  setError("passError", "");
  setError("confirmPassError", "");
  setError("colorError", "");
}

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearErrors();

  const nom = document.getElementById("nom").value.trim();
  const ageInput = document.getElementById("age").value.trim();
  let isAdmin = document.getElementById("admin").value;
  const MotDePasse = document.getElementById("MotDePasse").value.trim();
  const MotDePasseCon = document.getElementById("MotDePasseConfirmation").value.trim();
  const pseudo = document.getElementById("pseudo").value.trim();
  const prenom = document.getElementById("prenom").value.trim();
  const couleur = document.getElementById("couleur").value.trim();
  const Devise = document.getElementById("Devise").value.trim();
  const Pays = document.getElementById("Pays").value.trim();
  const avatarInput = document.getElementById("avatar").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const photoInput = document.getElementById("photo").value.trim();

  const nameRegex = /^[A-Za-z\s]{2,}$/;
  const pseudoRegex = /^[A-Za-z0-9_]{3,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  let hasError = false;

  if (!nameRegex.test(nom)) {
    setError("nomError", "❌ Invalid name");
    hasError = true;
  }

  if (!ageInput || isNaN(Number(ageInput))) {
    setError("ageError", "❌ Invalid age");
    hasError = true;
  }

  if (!pseudoRegex.test(pseudo)) {
    setError("pseudoError", "❌ Invalid username");
    hasError = true;
  }

  if (!emailRegex.test(email)) {
    setError("emailError", "❌ Invalid email");
    hasError = true;
  }

  if (!passwordRegex.test(MotDePasse)) {
    setError("passError", "❌ Weak password (8+ chars, 1 uppercase, 1 number, 1 special)");
    hasError = true;
  }

  if (MotDePasseCon !== MotDePasse) {
    setError("confirmPassError", "❌ Passwords do not match");
    hasError = true;
  }

  if (hasError) return;

  const user = {
    nom,
    age: Number(ageInput),
    admin: isAdmin === "true",
    MotDePasse,
    pseudo,
    prenom,
    couleur: couleur || "#6C63FF",
    Devise: Devise || "USD",
    Pays: Pays || "Morocco",
    avatar: avatarInput || "https://i.pravatar.cc/150",
    email,
    photo: photoInput || "https://i.pravatar.cc/150"
  };

  try {
    const res = await fetch(
      "https://69ecc98baf4ff533142b610f.mockapi.io/Stagiaire",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert("❌ Failed to create account");
      return;
    }

    localStorage.setItem("registeredUser", JSON.stringify(data));
    alert("✅ Account created successfully!");
    window.location.href = "login.html";

  } catch (err) {
    console.log(err);
    alert("❌ Something went wrong");
  }
});