const apiUrl = "https://graphql.anilist.co";

// Lista de personagens e katanas
const charactersWithKatanas = [
  { name: "Yoriichi Tsugikuni", katana: "Vermelho Carmesim", secondaryColor: null },
  { name: "Kokushibo", katana: "Carne", secondaryColor: "Roxo Claro" },
  { name: "Tanjirou Kamado", katana: "Preta", secondaryColor: null },
  { name: "Giyuu Tomioka", katana: "Azul", secondaryColor: null },
  { name: "Kyoujurou Rengoku", katana: "Vermelho", secondaryColor: null },
  { name: "Kaigaku", katana: "Amarelo", secondaryColor: null },
  { name: "Mitsuri Kanroji", katana: "Chicote", secondaryColor: "Rosa Escuro" },
  { name: "Gyoumei Himejima", katana: "Mangual e Machado", secondaryColor: "Cinza" },
  { name: "Sanemi Shinazugawa", katana: "Verde", secondaryColor: null },
  { name: "Kanao Tsuyuri", katana: "Rosa", secondaryColor: null },
  { name: "Shinobu Kochou", katana: "Ferrão", secondaryColor: null },
  { name: "Obanai Iguro", katana: "Espada Torcida", secondaryColor: "Branca" },
  { name: "Tengen Uzui", katana: "Cutelos duplos", secondaryColor: "Âmbar" },
  { name: "Muichirou Tokito", katana: "Branca", secondaryColor: "Azul" },
  { name: "Inosuke Hashibira", katana: "Duas espadas serrilhadas", secondaryColor: "Índigo" },
  { name: "Zenitsu Agatsuma", katana: "Amarelo", secondaryColor: null },
];

const ids = [101759, 104379, 107344, 112151, 129874, 145139, 166240, 178788];
let characters = [];
let currentCharacter = {};

const feedback = document.getElementById("feedback");
const characterImage = document.getElementById("character-image");

async function fetchCharacters() {
  const query = `
    query ($ids: [Int]) {
      Page {
        media(id_in: $ids, type: ANIME) {
          characters {
            edges {
              node {
                name {
                  full
                }
                image {
                  large
                }
              }
            }
          }
        }
      }
    }
  `;

  const variables = { ids };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });

    const data = await response.json();

    const allCharacters = data.data.Page.media.flatMap(media =>
      media.characters.edges.map(char => ({
        name: char.node.name.full,
        image: char.node.image.large,
      }))
    );

    characters = allCharacters
      .filter(char => charactersWithKatanas.some(c => c.name === char.name))
      .map(char => {
        const match = charactersWithKatanas.find(c => c.name === char.name);
        return {
          ...char,
          katana: match.katana,
          secondaryColor: match.secondaryColor,
        };
      });

    if (characters.length > 0) {
      loadCharacter();
    } else {
      feedback.textContent = "Nenhum personagem disponível.";
      feedback.style.color = "red";
    }
  } catch (error) {
    console.error("Erro ao carregar personagens:", error);
    feedback.textContent = "Erro ao carregar personagens. Tente novamente mais tarde.";
    feedback.style.color = "red";
  }
}

function loadCharacter() {
  if (characters.length === 0) {
    feedback.textContent = "Nenhum personagem disponível.";
    feedback.style.color = "red";
    return;
  }

  currentCharacter = characters[Math.floor(Math.random() * characters.length)];
  characterImage.src = currentCharacter.image || "https://via.placeholder.com/300x400";
  feedback.textContent = "";
}

function checkGuess(userGuess, correctKatana, correctSecondaryColor) {
  const normalizedGuess = userGuess.toLowerCase();
  const normalizedKatana = correctKatana.toLowerCase();
  const normalizedSecondaryColor = correctSecondaryColor ? correctSecondaryColor.toLowerCase() : null;

  const validAnswers = [normalizedKatana];
  if (normalizedSecondaryColor) {
    validAnswers.push(`${normalizedKatana}, ${normalizedSecondaryColor}`);
    validAnswers.push(normalizedSecondaryColor); 
  }

  return validAnswers.includes(normalizedGuess);
}


document.getElementById("submit-btn").addEventListener("click", () => {
  const userGuess = document.getElementById("guess-input").value.trim();
  const correctKatana = currentCharacter.katana;
  const correctSecondaryColor = currentCharacter.secondaryColor;

  if (checkGuess(userGuess, correctKatana, correctSecondaryColor)) {
    feedback.textContent = "Você acertou!";
    feedback.style.color = "green";

    setTimeout(() => {
      loadCharacter();
    }, 1500);
  } else {
    feedback.textContent = `Errado! A resposta correta é: ${correctKatana}${
      correctSecondaryColor ? `, ${correctSecondaryColor}` : ""
    }`;
    feedback.style.color = "red";
  }
});

fetchCharacters();
