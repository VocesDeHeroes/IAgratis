import { auth, db } from "./firebase.js";
import { 
  signInWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup 
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const loginDiv = document.getElementById("login");
const descargadorDiv = document.getElementById("descargador");

// 🔹 Login con Email y Contraseña
document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    await signInWithEmailAndPassword(auth, email, password);

    // Comprobar whitelist
    const ref = doc(db, "whitelist", email);
    const snap = await getDoc(ref);

    if (snap.exists() && snap.data().activo) {
      loginDiv.style.display = "none";
      descargadorDiv.style.display = "block";
    } else {
      alert("⚠️ Tu cuenta no tiene acceso al descargador");
      await signOut(auth);
    }
  } catch (e) {
    alert("Error al iniciar sesión. Verifica correo y contraseña.");
  }
});

// 🔹 Login con Google
document.getElementById("googleBtn").addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const email = result.user.email;

    // Comprobar whitelist
    const ref = doc(db, "whitelist", email);
    const snap = await getDoc(ref);

    if (snap.exists() && snap.data().activo) {
      loginDiv.style.display = "none";
      descargadorDiv.style.display = "block";
    } else {
      alert("⚠️ Tu cuenta no tiene acceso al descargador");
      await signOut(auth);
    }
  } catch (error) {
    alert("Error al iniciar sesión con Google");
  }
});

// 🔹 Lógica descargador
document.getElementById("descargarBtn").addEventListener("click", async () => {
  const url = document.getElementById("url").value;
  if (!url) return alert("Introduce un enlace válido");

  const apiUrl = `https://api.vxtwitter.com/${url.split("twitter.com/")[1]}`;
  try {
    const res = await fetch(apiUrl);
    const data = await res.json();

    const resultDiv = document.getElementById("resultado");
    resultDiv.innerHTML = "";
    data.media_extended.forEach(video => {
      const link = document.createElement("a");
      link.href = video.url;
      link.textContent = `Descargar (${Math.floor(video.bitrate / 1000)} kbps)`;
      link.target = "_blank";
      resultDiv.appendChild(link);
    });
  } catch (e) {
    alert("Error al descargar el video");
  }
});

// 🔹 Logout
document.getElementById("logoutBtn").addEventListener("click", async () => {
  await signOut(auth);
  loginDiv.style.display = "block";
  descargadorDiv.style.display = "none";
});
