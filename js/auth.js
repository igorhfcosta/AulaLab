import "./load-auth-styles.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  collection,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

let firebaseConfig = null;
let app = null;
let auth = null;
let db = null;
let currentUser = null;
let firebaseReady = false;

const fallbackKey = "aulalab:favoritos:local";

async function loadFirebaseConfig() {
  try {
    const module = await import("../firebase-config.js");
    firebaseConfig = module.firebaseConfig;
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    firebaseReady = true;
  } catch (error) {
    console.warn("Firebase ainda não configurado. Usando modo local temporário.", error);
    firebaseReady = false;
  }
}

function getLocalFavorites() {
  return JSON.parse(localStorage.getItem(fallbackKey) || "[]");
}

function setLocalFavorites(favorites) {
  localStorage.setItem(fallbackKey, JSON.stringify(favorites));
}

function setStatus(message, type = "info") {
  document.querySelectorAll("[data-auth-status]").forEach((element) => {
    element.textContent = message;
    element.dataset.type = type;
  });
}

function updateUserUI(user) {
  const loggedIn = Boolean(user);

  document.querySelectorAll("[data-user-name]").forEach((element) => {
    element.textContent = user?.displayName || user?.email || "Visitante";
  });

  document.querySelectorAll("[data-user-email]").forEach((element) => {
    element.textContent = user?.email || "Entre para sincronizar seus favoritos.";
  });

  document.querySelectorAll("[data-auth-visible]").forEach((element) => {
    const mode = element.dataset.authVisible;
    element.hidden = mode === "logged-in" ? !loggedIn : loggedIn;
  });

  document.querySelectorAll(".nav-login-link").forEach((element) => {
    element.textContent = loggedIn ? "Minha AulaLab" : "Entrar";
    element.href = loggedIn ? "minha-aulalab.html" : "entrar.html";
  });
}

async function getFavorites() {
  if (!firebaseReady || !currentUser) {
    return getLocalFavorites();
  }

  const snapshot = await getDocs(collection(db, "usuarios", currentUser.uid, "favoritos"));
  return snapshot.docs.map((item) => item.id);
}

async function saveFavorite(gameId, gameTitle) {
  if (!firebaseReady || !currentUser) {
    const favorites = new Set(getLocalFavorites());
    favorites.add(gameId);
    setLocalFavorites([...favorites]);
    setStatus("Favorito salvo neste navegador. Configure o Firebase para sincronizar por conta.", "warning");
    return;
  }

  await setDoc(doc(db, "usuarios", currentUser.uid, "favoritos", gameId), {
    gameId,
    title: gameTitle,
    createdAt: serverTimestamp()
  });
}

async function removeFavorite(gameId) {
  if (!firebaseReady || !currentUser) {
    setLocalFavorites(getLocalFavorites().filter((item) => item !== gameId));
    return;
  }

  await deleteDoc(doc(db, "usuarios", currentUser.uid, "favoritos", gameId));
}

async function refreshFavoriteButtons() {
  const favorites = await getFavorites();

  document.querySelectorAll("[data-favorite]").forEach((button) => {
    const gameId = button.dataset.favorite;
    const active = favorites.includes(gameId);
    button.classList.toggle("is-favorite", active);
    button.textContent = active ? "★ Favorito" : "☆ Favoritar";
    button.setAttribute("aria-pressed", String(active));
  });

  renderFavoritesList(favorites);
}

function renderFavoritesList(favorites) {
  const list = document.querySelector("[data-favorites-list]");
  if (!list) return;

  const gameTitles = {
    "carteado-probabilidade": "Carteado da Probabilidade",
    "bingo-funcoes": "Bingo das Funções",
    "corrida-equacoes": "Corrida das Equações",
    "missao-poligonos": "Missão dos Polígonos",
    "investigadores-dados": "Investigadores de Dados",
    "batalha-logaritmos": "Batalha dos Logaritmos"
  };

  if (!favorites.length) {
    list.innerHTML = `<p class="empty-state">Você ainda não favoritou nenhum jogo.</p>`;
    return;
  }

  list.innerHTML = favorites.map((gameId) => `
    <article class="favorite-item">
      <strong>${gameTitles[gameId] || gameId}</strong>
      <span>Jogo salvo na sua biblioteca.</span>
    </article>
  `).join("");
}

function setupFavoriteButtons() {
  document.querySelectorAll("[data-favorite]").forEach((button) => {
    button.addEventListener("click", async () => {
      const gameId = button.dataset.favorite;
      const gameTitle = button.dataset.title || gameId;
      const active = button.classList.contains("is-favorite");

      if (active) {
        await removeFavorite(gameId);
        setStatus("Jogo removido dos favoritos.", "info");
      } else {
        await saveFavorite(gameId, gameTitle);
        setStatus("Jogo salvo nos favoritos.", "success");
      }

      await refreshFavoriteButtons();
    });
  });
}

function setupAuthForms() {
  const googleButton = document.querySelector("[data-google-login]");
  const emailForm = document.querySelector("[data-email-auth]");
  const logoutButtons = document.querySelectorAll("[data-logout]");

  googleButton?.addEventListener("click", async () => {
    if (!firebaseReady) {
      setStatus("Configure o arquivo firebase-config.js para ativar login com Google.", "warning");
      return;
    }

    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      setStatus("Login realizado com sucesso.", "success");
    } catch (error) {
      setStatus("Não foi possível entrar com Google.", "error");
      console.error(error);
    }
  });

  emailForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!firebaseReady) {
      setStatus("Configure o arquivo firebase-config.js para ativar cadastro e login.", "warning");
      return;
    }

    const formData = new FormData(emailForm);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    const action = String(formData.get("action") || "login");

    try {
      if (action === "register") {
        await createUserWithEmailAndPassword(auth, email, password);
        setStatus("Conta criada com sucesso.", "success");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setStatus("Login realizado com sucesso.", "success");
      }
    } catch (error) {
      setStatus("Não foi possível concluir a ação. Confira e-mail e senha.", "error");
      console.error(error);
    }
  });

  logoutButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      if (firebaseReady && auth) {
        await signOut(auth);
      }
      currentUser = null;
      updateUserUI(null);
      await refreshFavoriteButtons();
      setStatus("Você saiu da conta.", "info");
    });
  });
}

await loadFirebaseConfig();
setupAuthForms();
setupFavoriteButtons();

if (firebaseReady && auth) {
  onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    updateUserUI(user);
    await refreshFavoriteButtons();
  });
} else {
  updateUserUI(null);
  await refreshFavoriteButtons();
}
