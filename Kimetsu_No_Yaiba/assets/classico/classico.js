const apiUrl = "https://graphql.anilist.co";
let characters = [];
let currentCharacter = {};

const allowedCharacters = new Set([
  "Kagaya Ubuyashiki", "Amane Ubuyashiki", "Hinaki Ubuyashiki", "Nichika Ubuyashiki",
  "Kiriya Ubuyashiki", "Kuina Ubuyashiki", "Kanata Ubuyashiki", "Giyuu Tomioka",
  "Mitsuri Kanroji", "Obanai Iguro", "Sanemi Shinazugawa", "Gyoumei Himejima",
  "Muichiro Tokitou", "Shinobu Kochou", "Kyojurou Rengoku", "Kanae Kocho",
  "Sakonji Urokodaki", "Jigoro Kuwajima", "Shinjuro Rengoku", "Tengen Uzui",
  "Kanao Tsuyuri", "Tanjirou Kamado", "Zenitsu Agatsuma", "Inosuke Hashibira",
  "Genya Shinazugawa", "Murata", "Ozaki", "Takeuchi", "Nagakura", "Noguchi",
  "Yoriichi Tsugikuni", "Aoi Kanzaki", "Sumi Nakahara", "Kiyo Terauchi", "Naho Takada",
  "Goto", "Hotaru Haganezuka", "Kozo Kanamori", "Tecchin Tecchikawahara",
  "Kotetsu", "Tetsumotonaka", "Tetsudoji", "Tetsutani", "Tetsuido", "Muzan Kibutsuji",
  "Nezuko Kamado", "Tamayo", "Yushiro", "Susamaru", "Yahaba", "Shizu Shinazugawa",
  "Temple Demon", "Hand Demon", "Swamp Demon", "Asakusa Demon", "Tongue Demon",
  "Horned Demon", "Spider Demon (Mother)", "Spider Demon (Father)", 
  "Spider Demon (Son)", "Spider Demon (Daughter)", "Slasher", "Mantis Demon", 
  "Woodland Demon", "Kokushibo", "Douma", "Akaza", "Nakime", "Hantengu", "Gyokko", 
  "Gyuutarou", "Daki", "Enmu", "Rokuro", "Wakuraba", "Mukago", "Rui", "Kamanue", "Kyogai"
]); // MANO QUANTO PERSNOAGEM INUTIL DEUS ME LIVRE

const feedback = document.getElementById("feedback");
const characterImage = document.getElementById("character-image");
const submitButton = document.getElementById("submit-btn");

// IDs de todas as temporadas e filmes
const ids = [101759, 104379, 107344, 112151, 129874, 145139, 166240, 178788];

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

    if (!data?.data?.Page?.media) {
      throw new Error("Nenhum dado de mídia retornado da API.");
    }

    const allCharacters = data.data.Page.media.flatMap(media =>
      media.characters.edges.map(char => ({
        name: char.node.name.full,
        image: char.node.image.large,
      }))
    );

    console.log("Personagens retornados:", allCharacters); 

    characters = allCharacters.filter(
      (char, index, self) =>
        allowedCharacters.has(char.name) &&
        self.findIndex(c => c.name === char.name) === index
    );

    console.log("Personagens permitidos:", characters); 

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

function checkGuess(userGuess, characterName) {
  const mainName = characterName.split(" ")[0].toLowerCase();
  return userGuess.toLowerCase() === mainName || userGuess.toLowerCase() === characterName.toLowerCase();
}

async function triggerConfetti() {
  const confettiSettings = {
    particleCount: 100,
    spread: 60,
    origin: { y: 0.6 },
  };
  confetti(confettiSettings);
}

submitButton.addEventListener("click", async () => {
  const userGuess = document.getElementById("guess-input").value.trim();
  const characterName = currentCharacter.name;

  if (checkGuess(userGuess, characterName)) {
    feedback.textContent = "Você acertou! 🎉";
    feedback.style.color = "green";

    await triggerConfetti();

    submitButton.disabled = true;
    submitButton.style.backgroundColor = "green";
    submitButton.style.color = "white";

    setTimeout(() => {
      submitButton.disabled = false;
      submitButton.style.backgroundColor = "";
      submitButton.style.color = "";
      document.getElementById("guess-input").value = ""; 
      loadCharacter(); 
    }, 1500);
  } else {
    feedback.textContent = "Tente novamente! 😞";
    feedback.style.color = "red";
  }
});

fetchCharacters();

// baby you got bad habits