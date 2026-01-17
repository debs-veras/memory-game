const grid = document.querySelector(".grid");
const timer = document.querySelector(".timer");
const spanTurn = document.querySelector(".turn");
const score1 = document.getElementById("score1");
const score2 = document.getElementById("score2");
const scorePlayer2 = document.querySelector(".score-2");
const spanPlayer = document.querySelector(".player");
const characters = [
  "beth",
  "jerry",
  "jessica",
  "morty",
  "pessoa-passaro",
  "pickle-rick",
  "rick",
  "summer",
  "meeseeks",
  "scroopy",
];

const players = JSON.parse(localStorage.getItem("players"));
const mode = localStorage.getItem("mode");

let currentPlayer = 0;
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let loop;

/* criação dos elemeentos */
const createElement = (tag, className) => {
  const element = document.createElement(tag);
  element.className = className;
  return element;
};
/* cartas */
const createCard = (character) => {
  const card = createElement("div", "card");
  const front = createElement("div", "face front");
  const back = createElement("div", "face back");
  front.style.backgroundImage = `url('../images/${character}.png')`;
  card.append(front, back);
  card.dataset.character = character;
  card.addEventListener("click", revealCard);
  return card;
};
// carregamento do jogo
const loadGame = () => {
  const shuffled = [...characters, ...characters].sort(
    () => Math.random() - 0.5,
  );

  shuffled.forEach((character) => {
    grid.appendChild(createCard(character));
  });
};

/* HUD */
const updateHUD = () => {
  if (mode === "solo") {
    spanPlayer.innerHTML = `Jogador: ${players[0].name}`;
    spanTurn.innerHTML = "";
    scorePlayer2.style.display = "none";
  } else {
    spanPlayer.innerHTML = "";
    spanTurn.innerHTML = `Vez de: ${players[currentPlayer].name}`;
    scorePlayer2.style.display = "block";
  }

  score1.innerHTML = players[0].score;

  if (mode === "versus") {
    score2.innerHTML = players[1].score;
  }
};

/* jogabilidade */
const revealCard = ({ target }) => {
  if (lockBoard) return;
  const card = target.parentNode;
  if (card.classList.contains("reveal-card")) return;
  card.classList.add("reveal-card");
  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  lockBoard = true;
  checkMatch();
};

const checkMatch = () => {
  const isMatch = firstCard.dataset.character === secondCard.dataset.character;

  if (isMatch) {
    players[currentPlayer].score++;
    disableCards();
    resetCards();
    updateHUD();
    checkEndGame();
  } else {
    setTimeout(() => {
      firstCard.classList.remove("reveal-card");
      secondCard.classList.remove("reveal-card");
      resetCards();

      if (mode === "versus") {
        currentPlayer = currentPlayer === 0 ? 1 : 0;
        updateHUD();
      }
    }, 800);
  }
};

const disableCards = () => {
  firstCard.firstChild.classList.add("disabled-card");
  secondCard.firstChild.classList.add("disabled-card");
};

const resetCards = () => {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
};

/* fim de jogo */
const checkEndGame = () => {
  const disabledCards = document.querySelectorAll(".disabled-card");
  if (disabledCards.length === characters.length * 2) {
    clearInterval(loop);
    let message = "";
    if (mode === "solo")
      message = `Parabéns, ${players[0].name}! Tempo: ${timer.innerHTML}s`;
    else {
      if (players[0].score > players[1].score)
        message = `${players[0].name} venceu!`;
      else if (players[1].score > players[0].score)
        message = `${players[1].name} venceu!`;
      else message = "Empate!";
    }

    alert(message);
  }
};

/* timer */
const startTimer = () => {
  loop = setInterval(() => {
    timer.innerHTML = Number(timer.innerHTML) + 1;
  }, 1000);
};

/* init */
window.onload = () => {
  updateHUD();
  startTimer();
  loadGame();
};
