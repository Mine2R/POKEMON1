// 🌀 Liste des cartes énergie
const energyCards = [
  { name: "eau", image: "../asset/TCG/eau.png" },
  { name: "electrique", image: "../asset/TCG/electrique.png" },
  { name: "fairy", image: "../asset/TCG/fairy.png" },
  { name: "metal", image: "../asset/TCG/metal.png" },
  { name: "feu", image: "../asset/TCG/feu.png" },
  { name: "nature", image: "../asset/TCG/nature.png" }
];
const backImage = "../asset/TCG/dos-de-carte.jpeg";

let moveCount = 0, matchedPairs = 0, timer = 0, timerInterval, confettiInterval;
const totalPairs = 6;
const flipSound = new Audio("../sons/flip.mp3");
const matchSound = new Audio("../sons/match.mp3");
const winSound = new Audio("../sons/win.mp3");
const poussifeu = document.getElementById('poussifeu-jump');
const cry = new Audio('../sons/poussifeucry.mp3');

// 🔦 Flash lumineux (fonction réutilisable)
function triggerFlash() {
  const flash = document.getElementById("flash-effect");
  flash.classList.remove("pika-flash");
  flash.classList.remove("hidden");
  void flash.offsetWidth;
  flash.classList.add("pika-flash");
  setTimeout(() => {
    flash.classList.remove("pika-flash");
    flash.classList.add("hidden");
  }, 1000);
}


// ⚙️ Fonction d'animation de Poussifeu
function poussifeuJumpAndCry() {
  console.log("→ Poussifeu devrait sauter !");
  poussifeu.style.display = 'block';
  poussifeu.classList.add('jump');
  cry.currentTime = 0;
  cry.play();
  setTimeout(() => {
    poussifeu.classList.remove('jump');
  }, 1000);
}




// 🎉 Confettis améliorés
function launchPokemonConfetti() {
  const container = document.getElementById("confetti-container");
  if (!container) return;
  stopConfetti();

  const pokemons = [
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png"
  ];

  confettiInterval = setInterval(() => {
    for (let i = 0; i < 2; i++) {
      const img = document.createElement("img");
      img.src = pokemons[Math.floor(Math.random() * pokemons.length)];
      img.classList.add("confetti-pokemon");
      img.style.left = `${Math.random() * 100}vw`;
      img.style.top = `-${Math.random() * 100}px`;
      img.style.animationDuration = `${1 + Math.random() * 1.5}s`;
      container.appendChild(img);
      setTimeout(() => img.remove(), 3000);
    }
  }, 100);
}

// ⏱ Timer
function startTimer() {
  timer = 0;
  timerInterval = setInterval(() => {
    timer++;
    const m = String(Math.floor(timer/60)).padStart(2,'0');
    const s = String(timer % 60).padStart(2,'0');
    document.getElementById("timer").textContent = `Temps : ${m}m ${s}s`;
  }, 1000);
}

// 👍 Shuffle + affichage
function shuffleCards() {
  return [...energyCards, ...energyCards].sort(() => Math.random() - 0.5);
}
function displayCards(cards) {
  const board = document.getElementById("memory-board");
  board.innerHTML = "";
  cards.forEach(c => {
    const cardEl = document.createElement("div");
    cardEl.className = "card";
    cardEl.dataset.name = c.name;
    cardEl.innerHTML = `
      <div class="front"><img src="${c.image}" /></div>
      <div class="back"><img src="${backImage}" /></div>
    `;
    cardEl.className = "card card-hidden"; // <-- ajoute card-hidden

    board.appendChild(cardEl);
  });
  addCardClickLogic();
  function animateCardsIndividually() {
  const cards = document.querySelectorAll('.card');

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('card-visible');
          cardObserver.unobserve(entry.target);
        }, index * 100); // ⏱ délai croissant = effet "cascade"
      }
    });
  }, { threshold: 0.2 });

  cards.forEach(card => cardObserver.observe(card));
}

}

// Affichage des cartes
function displayCards(cards) {
  const board = document.getElementById("memory-board");
  board.innerHTML = "";
  cards.forEach(c => {
    const cardEl = document.createElement("div");
    cardEl.className = "card card-hidden"; // Pour l'effet d'apparition
    cardEl.dataset.name = c.name;
    cardEl.innerHTML = `
      <div class="front"><img src="${c.image}" /></div>
      <div class="back"><img src="${backImage}" /></div>
    `;
    board.appendChild(cardEl);
  });
  addCardClickLogic();
}


// 🎬 Animation Intersection Observer pour les cartes
function animateCardsIndividually() {
  const cards = document.querySelectorAll('.card');

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('card-visible');
          cardObserver.unobserve(entry.target);
        }, index * 100);
      }
    });
  }, { threshold: 0.2 });

  cards.forEach(card => cardObserver.observe(card));
}
// 🔁 Logique du jeu
function addCardClickLogic() {
  const cards = document.querySelectorAll(".card");
  let first, second, lock;

  cards.forEach(card => card.addEventListener("click", () => {
    if (lock || card.classList.contains("matched") || card === first) return;
    card.classList.add("flipped"); flipSound.play();

    if (!first) { first = card; return; }
    second = card; lock = true; moveCount++;
    document.getElementById("move-counter").textContent = `Coups : ${moveCount}`;

    const match = first.dataset.name === second.dataset.name;
    if (match) {
      first.classList.add("matched");
      second.classList.add("matched");
      matchedPairs++;
      matchSound.play();

if (matchedPairs === totalPairs) {
  stopTimer();
  winSound.play().catch(console.error);
  setTimeout(() => { 
    document.getElementById("win-message").classList.remove("hidden");
    // ⬇️ AJOUTE cette ligne juste en dessous :
    document.getElementById("win-text").textContent = "Bravo, tu as gagné !";

    document.getElementById("victory-banner").classList.add("show");
    document.getElementById("light-ray").classList.add("ray-animate");
    launchPokemonConfetti();
    poussifeuJumpAndCry();
    document.querySelectorAll('.card').forEach(c => c.classList.add('victory-spin'));
    setTimeout(() => document.getElementById("victory-banner").classList.remove("show"), 4000);
    setTimeout(() => document.getElementById("light-ray").classList.remove("ray-animate"), 1000);
  }, 500);
  
}
      first = second = lock = null;
    } else {
      setTimeout(() => {
        first.classList.remove("flipped");
        second.classList.remove("flipped");
        first = second = lock = null;
      }, 1000);
    }
  }));
}

function stopConfetti() {
  clearInterval(confettiInterval);
  document.getElementById("confetti-container").innerHTML = "";
}

function stopTimer() {
  clearInterval(timerInterval);
}

// 🛠 Initialisation
function initGame() {
  const board = document.getElementById("memory-board");
  const title = document.querySelector(".memory-title");
  const ui = document.querySelector(".game-ui");
  const replayBtn = document.getElementById("replay-btn");
  const winMessage = document.getElementById("win-message");

  document.getElementById("win-text").textContent = "À toi de jouer !";

  // Affiche tous les éléments essentiels
  board.classList.remove("hidden");
  title.classList.remove("hidden");
  ui.classList.remove("hidden");

  // Cache juste le message de victoire mais garde le bouton rejouer visible
  winMessage.classList.add("hidden");
  replayBtn.style.display = "inline-block"; // Affiche le bouton même sans victoire

  displayCards(shuffleCards());
  startTimer();
  animateCardsIndividually();

}

function showVictoryBanner() {
  const banner = document.getElementById('victory-banner');
  banner.style.display = 'block';
}

// 🔁 Réinitialisation
function resetGame() {
  stopTimer();
  timer = 0;
  moveCount = 0;
  matchedPairs = 0;
  document.getElementById("timer").textContent = "Temps : 0m 00s";
  document.getElementById("move-counter").textContent = "Coups : 0";
  document.getElementById("win-message").classList.add("hidden");
  document.getElementById("victory-banner").classList.remove("show");
  document.getElementById("win-text").textContent = "À toi de jouer !";

  document.querySelectorAll('.card').forEach(c => c.classList.remove('victory-spin'));
  stopConfetti();
  
  // ⬇️ Important : on réinitialise le jeu AVANT d'appeler le flash
  initGame();

  // ✅ Et maintenant on déclenche le flash APRES que le DOM soit prêt
  triggerFlash();
}


// 📅 Au chargement
document.addEventListener("DOMContentLoaded", () => {
  initGame();

  // 🍔 Menu burger
  const burger = document.getElementById("burger-menu");
  const navRight = document.querySelector(".nav-right");
  burger.addEventListener("click", () => {
    navRight.classList.toggle("active");
  });

  // ✨ Apparition des éléments
  window.addEventListener("load", () => {
    document.querySelectorAll('.hidden').forEach(el => {
      el.classList.add('show');
    });
  });

  // 🐣 Poussifeu au lancement
  setTimeout(() => {
    poussifeuJumpAndCry();
  }, 600);

  // ⚡ Flash
  triggerFlash();

  // 🔊 Préchargement sons
  flipSound.load();
  matchSound.load();
  winSound.load();

  // 🔁 Bouton rejouer
  const replayBtn = document.getElementById("replay-btn");
  replayBtn.style.display = "inline-block"; // ✅ toujours visible
  replayBtn.addEventListener("click", resetGame);
});

// 🔄 Rotation / redimensionnement
window.addEventListener('resize', adjustScaleOnRotation);
function adjustScaleOnRotation() {
  const container = document.querySelector('.memory-container');
  if (window.innerHeight < 450 && window.innerWidth > window.innerHeight) {
    container.style.transform = 'scale(0.88)';
  } else {
    container.style.transform = 'scale(1)';
  }
  function adjustScaleForSmallLandscape() {
  const container = document.querySelector('.memory-container');
  const height = window.innerHeight;
  const width = window.innerWidth;

  if (width > height && height < 480) {
    if (height < 400) {
      container.style.transform = 'scale(0.68)';
    } else if (height < 430) {
      container.style.transform = 'scale(0.72)';
    } else if (height < 500) {
      container.style.transform = 'scale(0.75)';
    } else {
      container.style.transform = 'scale(0.85)';
    }
    container.style.transformOrigin = 'top center';
  } else {
    container.style.transform = 'scale(1)';
  }
}

// Appelle la fonction à chaque resize ET au chargement
window.addEventListener('resize', adjustScaleForSmallLandscape);
window.addEventListener('orientationchange', adjustScaleForSmallLandscape);
document.addEventListener('DOMContentLoaded', adjustScaleForSmallLandscape);

}

window.addEventListener("orientationchange", () => {
  window.location.reload();
});
function adjustScaleForLandscape() {
  const isLandscape = window.innerWidth > window.innerHeight;
  const shortHeight = window.innerHeight <= 430;
  const container = document.querySelector('.memory-container');

  if (isLandscape && shortHeight) {
    container.style.transform = 'scale(0.75)';
    container.style.transformOrigin = 'top center';
  } else {
    container.style.transform = 'none';
  }
}

window.addEventListener('load', adjustScaleForLandscape);
window.addEventListener('resize', adjustScaleForLandscape);















