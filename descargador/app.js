import { auth, db } from "./firebase.js";
import { 
  signInWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithRedirect, 
  getRedirectResult 
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const loginDiv = document.getElementById("login");
const descargadorDiv = document.getElementById("descargador");

alert("DEBUG: app.js cargado correctamente");

// 🔹 Comprobación si venimos del redirect de Google
getRedirectResult(auth).then(async (result) => {
  alert("DEBUG: Entrando en getRedirectResult");
  
  if (result) {
    alert("DEBUG: getRedirectResult tiene result");
    const email = result.user.email.toLowerCase();
    alert("DEBUG: Email detectado → " + email);

    // Comprobar whitelist
    const ref = doc(db, "whitelist", email);
    const snap = await getDoc(ref);

    if (snap.exists() && snap.data().activo) {
      alert("DEBUG: Usuario está en whitelist ✅");
      loginDiv.style.display = "none";
      descargadorDiv.style.display = "block";
    } else {
      alert("DEBUG: Usuario NO está en whitelist ❌");
      await signOut(auth);
    }
  } else {
    alert("DEBUG: result es NULL (no venimos de redirect)");
  }
}).catch((err) => {
  alert("DEBUG ERROR en redirect: " + err.message);
});

// 🔹 Login con Email y Contraseña
document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim().toLowerCase();
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
      alert("⚠️ No estás en la whitelist o tu cuenta no tiene activo:true");
      await signOut(auth);
    }
  } catch (e) {
    alert("Error al iniciar sesión. Verifica correo y contraseña.");
  }
});

// 🔹 Login con Google usando Redirect
document.getElementById("googleBtn").addEventListener("click", async () => {
  alert("DEBUG: Pulsado botón Google");
  const provider = new GoogleAuthProvider();
  await signInWithRedirect(auth, provider);
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
