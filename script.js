let deckId;
let previousCardValue;
let currentCardValue;
let currentStreak = 0;
let currentErrors = 0;

const errorThreshold = 3;

const streakElement = document.getElementById("streak");
const errorElement = document.getElementById("error");
const cardImageElement = document.getElementById("card-image");
const startButtonElement = document.getElementById("start-button");
const higherButtonElement = document.getElementById("higher-button");
const lowerButtonElement = document.getElementById("lower-button");

async function getDeck(){
  const response = await fetch(
    "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
  );
  const data = await response.json();
  return data.deck_id;
}

async function drawCard(){
  const response = await fetch(
    `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
  );
  const data = await response.json();
  currentCardValue = getCardValue(data.cards[0].value);
  cardImageElement.src = data.cards[0].image;
}

function getCardValue(cardValue){
  switch(cardValue){
    case "ACE":
      return 1;
    case "JACK":
      return 11;
    case "QUEEN":
      return 12;
    case "KING":
      return 13;
    default:
      return parseInt(cardValue);
  }
}

async function startGame(){
  deckId = await getDeck();
  currentStreak = 0;
  currentErrors = 0;
  streakElement.textContent = currentStreak;
  errorElement.textContent = currentErrors;
  cardImageElement.src = "https://deckofcardsapi.com/static/img/AC.png";
  higherButtonElement.disabled = false;
  lowerButtonElement.disabled = false;
}

async function higherClick(){
  await drawCard();
  if(currentCardValue > previousCardValue){
    currentStreak++;
    streakElement.textContent = currentStreak;
  }else{
    currentErrors++;
    errorElement.textContent = currentErrors;
    if(currentErrors >= errorThreshold){
      currentStreak = 0;
      streakElement.textContent = currentStreak;
      currentErrors = 0;
      errorElement.textContent = currentErrors;
    }
  }
  previousCardValue = currentCardValue;
}

async function lowerClick(){
  await drawCard();
  if(currentCardValue < previousCardValue){
    currentStreak++;
    streakElement.textContent = currentStreak;
  }else{
    currentErrors++;
    errorElement.textContent = currentErrors;
    if(currentErrors >= errorThreshold){
      currentStreak = 0;
      streakElement.textContent = currentStreak;
      currentErrors = 0;
      errorElement.textContent = currentErrors;
    }
  }
  previousCardValue = currentCardValue;
}

startButtonElement.addEventListener("click", () => {
  startGame();
});

higherButtonElement.addEventListener("click", () => {
  if(deckId){
    higherClick();
  }
});

lowerButtonElement.addEventListener("click", () => {
  if(deckId){
    lowerClick();
  }
});
