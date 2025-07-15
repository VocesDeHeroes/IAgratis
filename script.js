// Reemplaza estos valores con los de tu proyecto Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB6_o_Mm6QG7sHOD5zKITeVGhAtvKz25ZM",
    authDomain: "iagratuita.firebaseapp.com",
    projectId: "iagratuita",
    appId: "1:133887632889:web:8c2136bae705aeb1a9c928"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

function register() {
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;
    auth.createUserWithEmailAndPassword(email, pass)
        .then(() => alert("Registrado correctamente"))
        .catch(e => alert(e.message));
}

function login() {
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;
    auth.signInWithEmailAndPassword(email, pass)
        .catch(e => alert(e.message));
}

function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .catch(e => alert(e.message));
}

function logout() {
    auth.signOut();
}

auth.onAuthStateChanged(user => {
    if (user) {
        document.getElementById("auth").style.display = "none";
        document.getElementById("content").style.display = "block";
    } else {
        document.getElementById("auth").style.display = "block";
        document.getElementById("content").style.display = "none";
    }
});
