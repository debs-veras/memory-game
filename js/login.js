const form = document.querySelector(".login-form");
const player1Input = document.getElementById("player1");
const player2Input = document.getElementById("player2");
const modeInputs = document.querySelectorAll("input[name='mode']");
const button = document.querySelector(".login-button");
const enableButton = () => button.removeAttribute("disabled");
const disableButton = () => button.setAttribute("disabled", "");
const isPlayer1Valid = () => player1Input.value.length > 3;
const isPlayer2Valid = () => player2Input.value.length > 3;


let gameMode = "solo";

/* validação geral */
const validateForm = () => {
  if (gameMode === "solo" && isPlayer1Valid()) {
    enableButton();
    return;
  }

  if (gameMode === "versus" && isPlayer1Valid() && isPlayer2Valid()) {
    enableButton();
    return;
  }

  disableButton();
};

/* input jogador 1 */
player1Input.addEventListener("input", validateForm);
/* input jogador 2 */
player2Input.addEventListener("input", validateForm);

/* seleção de modo */
modeInputs.forEach((modeInput) => {
  modeInput.addEventListener("change", (e) => {
    gameMode = e.target.value;

    if (gameMode === "versus") {
      player2Input.disabled = false;
      player2Input.required = true;
      player2Input.value = "";
    } else {
      player2Input.disabled = true;
      player2Input.required = false;
      player2Input.value = "";
    }

    validateForm();
  });
});

/* submit */
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const players = [{ name: player1Input.value, score: 0 }];

  if (gameMode === "versus")
    players.push({ name: player2Input.value, score: 0 });

  localStorage.setItem("players", JSON.stringify(players));
  localStorage.setItem("mode", gameMode);

  window.location.href = "./pages/game.html";
});
