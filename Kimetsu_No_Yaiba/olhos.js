const apiUrl = "https://graphql.anilist.co";
const feedback = document.getElementById("feedback");
const characterImage = document.getElementById("character-image");
const submitButton = document.getElementById("submit-btn");

// IDs de todas as temporadas e filmes
const ids = [101759, 104379, 107344, 112151, 129874, 145139, 166240, 178788];

// Lista permitida de personagens e suas cores de olhos
const eyeColors = {
  "Kagaya Ubuyashiki": "Lavanda",
  "Amane Ubuyashiki": "Roxo Ameixa",
  "Hinaki Ubuyashiki": "Ameixa",
  "Kiriya Ubuyashiki": "Preto",
  "Kuina Ubuyashiki": "Ameixa",
  "Kanata Ubuyashiki": "Ameixa",
  "Giyuu Tomioka": "Azul Lapis",
  "Mitsuri Kanroji": "Verde Claro",
  "Obanai Iguro": "Amarelo, Cerceta",
  "Sanemi Shinazugawa": "Roxo Pálido",
  "Gyomei Himejima": "Branco",
  "Muichiro Tokitou": "Ciano",
  "Shinobu Kochou": "Roxo",
  "Kyojurou Rengoku": "Dourados",
  "Kanae Kocho": "Roxo Pálido",
  "Muzan Kibutsuji": "Vermelho Ameixa",
  "Nezuko Kamado": "Rosa Pálido",
  "Tamayo": "Roxo Escuro",
  "Yushiro": "Lavanda",
  "Susamaru": "Amarelo",
  "Yahaba": "Vermelho",
  "Temple Demon": "Preto",
  "Hand Demon": "Amarelo Pálido",
  "Swamp Demon": "Vermelho",
  "Asakusa Demon": "Marrom",
  "Tongue Demon": "Verde",
  "Horned Demon": "Vermelho Escuro",
  "Spider Demon (Mother)": "Azul Claro",
  "Spider Demon (Father)": "Cerceta",
  "Spider Demon (Son)": "Preto",
  "Spider Demon (Daughter)": "Prata",
  "Kokushibo": "Dourado",
  "Douma": "Arco-Íris",
  "Akaza": "Amarelo",
  "Nakime": "Rosa",
  "Hantengu": "Amarelo",
  "Gyokko": "Castanho Mel",
  "Gyuutarou": "Vermelho",
  "Daki": "Prata",
  "Enmu": "Azul",
  "Rokuro": "Dourado",
  "Wakuraba": "Laranja",
  "Mukago": "Roxo Acinzentado",
  "Rui": "Branco",
  "Kamanue": "Azul Pálido",
  "Kyogai": "Vermelho Sangue",
};

const allowedCharacters = new Set(Object.keys(eyeColors));
let characters = [];
let currentCharacter = {};

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

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query, variables: { ids } }),
    });

    const data = await response.json();
    console.log("Resposta da API:", data);

    const allCharacters = data.data.Page.media.flatMap(media =>
      media.characters.edges.map(char => ({
        name: char.node.name.full,
        image: char.node.image.large,
      }))
    );

    characters = allCharacters.filter(
      (char, index, self) =>
        allowedCharacters.has(char.name) &&
        self.findIndex(c => c.name === char.name) === index
    );

    if (characters.length === 0) {
      feedback.textContent = "Nenhum personagem permitido encontrado.";
      feedback.style.color = "red";
      return;
    }

    loadCharacter();
  } catch (error) {
    console.error("Erro ao carregar personagens:", error.message);
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

submitButton.addEventListener("click", async () => {
  const userGuess = document.getElementById("guess-input").value.trim();
  const correctEyeColor = eyeColors[currentCharacter.name];

  if (userGuess.toLowerCase() === correctEyeColor.toLowerCase()) {
    feedback.textContent = "Você acertou! 🎉";
    feedback.style.color = "green";

    setTimeout(() => {
      document.getElementById("guess-input").value = "";
      loadCharacter();
    }, 1500);
  } else {
    feedback.textContent = `Errado! A resposta correta é: ${correctEyeColor}`;
    feedback.style.color = "red";
  }
});

fetchCharacters();
