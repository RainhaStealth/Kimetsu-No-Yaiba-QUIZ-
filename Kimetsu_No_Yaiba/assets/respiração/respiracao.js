const apiUrl = "https://graphql.anilist.co";

// personagi
const charactersWithBreaths = [
  { name: "Yoriichi Tsugikuni", breath: "Respiração do Sol" },
  { name: "Kokushibo", breath: "Respiração da Lua" },
  { name: "Sumiyoshi Kamado", breath: "Respiração do Sol" },
  { name: "Tanjuro Kamado", breath: "Respiração do Sol" },
  { name: "Tanjirou Kamado", breath: "Respiração do Sol" },
  { name: "Kanata Kamado", breath: "Respiração do Sol" },
  { name: "Sumihiko Kamado", breath: "Respiração do Sol" },
  { name: "Sakonji Urokodaki", breath: "Respiração da Água" },
  { name: "Giyuu Tomioka", breath: "Respiração da Água" },
  { name: "Murata", breath: "Respiração da Água" },
  { name: "Sabito", breath: "Respiração da Água" },
  { name: "Makomo", breath: "Respiração da Água" },
  { name: "Aoi Kanzaki", breath: "Respiração da Água" },
  { name: "Shinjurou Rengoku", breath: "Respiração das Chamas" },
  { name: "Kyoujurou Rengoku", breath: "Respiração das Chamas" },
  { name: "Mitsuri Kanroji", breath: "Respiração das Chamas" },
  { name: "Jigoro Kuwajima", breath: "Respiração do Trovão" },
  { name: "Kaigaku", breath: "Respiração do Trovão" },
  { name: "Zenitsu Agatsuma", breath: "Respiração do Trovão" },
  { name: "Gyoumei Himejima", breath: "Respiração da Pedra" },
  { name: "Masachika Kumeno", breath: "Respiração do Vento" },
  { name: "Sanemi Shinazugawa", breath: "Respiração do Vento" },
  { name: "Kanae Kochou", breath: "Respiração da Flor" },
  { name: "Kanao Tsuyuri", breath: "Respiração da Flor" },
  { name: "Shinobu Kochou", breath: "Respiração do Inseto" },
  { name: "Obanai Iguro", breath: "Respiração da Serpente" },
  { name: "Mitsuri Kanroji", breath: "Respiração do Amor" },
  { name: "Tengen Uzui", breath: "Respiração do Som" },
  { name: "Muichirou Tokito", breath: "Respiração da Névoa" },
  { name: "Inosuke Hashibira", breath: "Respiração da Fera" },
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

  const variables = { ids }; // Passa todos os IDs

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

    characters = allCharacters.filter(char =>
      charactersWithBreaths.some(c => c.name === char.name)
    );

    characters = characters.map(char => ({
      ...char,
      breath: charactersWithBreaths.find(c => c.name === char.name).breath,
    }));

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

function checkGuess(userGuess, correctBreath) {
  return normalizeBreath(userGuess) === normalizeBreath(correctBreath);
}

function normalizeBreath(breath) {
  return breath.replace(/Respiração (do|da) /i, "").toLowerCase();
}

document.getElementById("submit-btn").addEventListener("click", () => {
  const userGuess = document.getElementById("guess-input").value.trim();
  const correctBreath = currentCharacter.breath;

  if (checkGuess(userGuess, correctBreath)) {
    feedback.textContent = "Você acertou!";
    feedback.style.color = "green";

    setTimeout(() => {
      loadCharacter();
    }, 1500);
  } else {
    feedback.textContent = `Errado! A resposta correta é: ${correctBreath}`;
    feedback.style.color = "red";
  }
});

fetchCharacters();

// blue lock goes hard as FUCK