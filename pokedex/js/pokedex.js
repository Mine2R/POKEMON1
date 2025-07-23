//chargement JSON
let pokemonData = [];
let currentIndex = 0;

fetch("../json/pokemon_151.json")
  .then((response) => response.json())
  .then((data) => {
    pokemonData = data;
    displayPokemon();
  });

//sélection du HTML
const pokemonImg = document.getElementById("pokemon-img");
const pokemonName = document.getElementById("pokemon-name");
const typeBg = document.getElementById("type-poke");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const firstBtn = document.getElementById("first");
const lastBtn = document.getElementById("last");


//formater un type en nom de fichier sans accents
function formatTypeToFilename(type) {
  return type.toLowerCase().replace(/\//g, "_") + ".png";
}

//affiche le Pokémon actuel
function displayPokemon() {
  const pokemon = pokemonData[currentIndex];

  //image du Pokémon
  pokemonImg.src = `../asset/page_pokedex/pokedex_pokemon/${pokemon.image}`;

  //nom du Pokémon
  pokemonName.textContent = pokemon.name;
  

  //image de fond selon le type
  const filename = formatTypeToFilename(pokemon.type);
  typeBg.src = `../asset/page_pokedex/fond_pokedex/${filename}`;
}

//boutons navigation
prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + pokemonData.length) % pokemonData.length;
  displayPokemon();
});

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % pokemonData.length;
  displayPokemon();
});


//boutons navigation last et first
firstBtn.addEventListener("click", () => {
  currentIndex = 0;
  displayPokemon();
});

lastBtn.addEventListener("click", () => {
  currentIndex = 150;
  displayPokemon();
});

// pikachu surfer
const pika = document.querySelector('.pika-surf');
const raichu = document.querySelector('.raichu-surf');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Pikachu va vers la droite
  if (pika) {
    pika.style.transform = `translateX(${scrollY * 0.5}px)`;
  }

  // Raichu va vers la gauche
  if (raichu) {
    raichu.style.transform = `translateX(-${scrollY * 0.3}px)`;
  }
});
