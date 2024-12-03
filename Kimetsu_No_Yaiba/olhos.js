const eyeColors = {
    "Tanjiro Kamado": "Vermelho",
    "Nezuko Kamado": "Rosa",
    "Zenitsu Agatsuma": "Amarelo",
    "Giyu Tomioka": "Azul",
  };
  
  let characters = [];
  let currentCharacter = {};
  
  async function fetchCharacters() {
    try {
      const response = await fetch("https://api.jikan.moe/v4/anime/38000/characters");
      const data = await response.json();
      characters = data.data.filter(char => eyeColors[char.character.name]);
      loadCharacter();
    } catch (error) {
      console.error("Erro ao carregar personagens:", error);
    }
  }
  
  function loadCharacter() {
    currentCharacter = characters[Math.floor(Math.random() * characters.length)];
    document.getElementById("character-image").src = currentCharacter.character.images.jpg.image_url;
    document.getElementById("feedback").textContent = "";
  }
  
  document.getElementById("submit-btn").addEventListener("click", () => {
    const userGuess = document.getElementById("guess-input").value.trim();
    const correctEyeColor = eyeColors[currentCharacter.character.name];
    if (userGuess.toLowerCase() === correctEyeColor.toLowerCase()) {
      document.getElementById("feedback").textContent = "Você acertou! 🎉";
      document.getElementById("feedback").style.color = "green";
      loadCharacter();
    } else {
      document.getElementById("feedback").textContent = `Errado! A resposta correta é: ${correctEyeColor}`;
      document.getElementById("feedback").style.color = "red";
    }
  });
  
  fetchCharacters();
  