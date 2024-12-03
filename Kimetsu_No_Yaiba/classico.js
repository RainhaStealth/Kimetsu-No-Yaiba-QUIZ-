const apiUrl = "https://api.jikan.moe/v4/anime/38000/characters";
let characters = [];
let currentCharacter = {};

const feedback = document.getElementById("feedback");
const characterImage = document.getElementById("character-image");

async function fetchCharacters() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    characters = data.data.filter(char => char.role === "Main");
    loadCharacter();
  } catch (error) {
    console.error("Erro ao carregar personagens:", error);
    feedback.textContent = "Erro ao carregar personagens. Tente novamente.";
  }
}

function loadCharacter() {
  currentCharacter = characters[Math.floor(Math.random() * characters.length)];
  characterImage.src = currentCharacter.character.images.jpg.image_url;
  feedback.textContent = ""; // Limpar feedback ao carregar novo personagem
}

document.getElementById("submit-btn").addEventListener("click", () => {
  const userGuess = document.getElementById("guess-input").value.trim();
  if (userGuess.toLowerCase() === currentCharacter.character.name.toLowerCase()) {
    feedback.textContent = "Você acertou! 🎉";
    feedback.style.color = "green";
    loadCharacter();
  } else {
    feedback.textContent = "Tente novamente! 😞";
    feedback.style.color = "red";
  }
});

// Carregar personagens ao iniciar a página
fetchCharacters();

  