function play(userChoice) {
  const choices = ['stone', 'paper', 'scissor'];
  const botChoice = choices[Math.floor(Math.random() * 3)];

  let result = "";

  if (userChoice === botChoice) {
    result = "Draw!";
  } else if (
    (userChoice === 'stone' && botChoice === 'scissor') ||
    (userChoice === 'paper' && botChoice === 'stone') ||
    (userChoice === 'scissor' && botChoice === 'paper')
  ) {
    result = "You Win!";
  } else {
    result = "You Lose!";
  }

  document.getElementById("result").innerText =
    "You: " + userChoice +
    " | Bot: " + botChoice +
    " → " + result;
}