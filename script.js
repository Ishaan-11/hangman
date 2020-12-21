const wordEle = document.getElementById('word');
const wrongLetterEle = document.getElementById('wrong-letters');
const playAgainBtn = document.getElementById('play-button');
const popupContainer = document.getElementById('popup-container');
const notificationContainer = document.getElementById('notification-container');
const finalMessage = document.getElementById('final-message');
const finalMessageReveal = document.getElementById('final-message-reveal-word');

const figurePart = document.querySelectorAll('.figure-part'); 

// const words = ['application', 'programming', 'interface', 'wizard'];

// let randomWord =  words[Math.floor(Math.random() * words.length)];

let randomWord = '';

let playable = true;

let correctLetters = [];
let wrongLetters = [];

//get random word from api
async function getRandomWord() {
  const res = await fetch('https://random-word-api.herokuapp.com/word?number=1');
  const data = await res.json();

  return data[0];
}

// Show hidden word
function showWord() {
	wordEle.innerHTML = `
    ${randomWord
			.split('')
			.map(
				letter => `
          <span class="letter">
            ${correctLetters.includes(letter) ? letter : ''}
          </span>
        `
			)
			.join('')}
  `;

	const innerWord = wordEle.innerText.replace(/[ \n]/g, '');

	if (innerWord === randomWord) {
    finalMessage.innerText = 'Congratulations! You won! 😃';
    finalMessageReveal.innerText = '';
		popupContainer.style.display = 'flex';

		playable = false;
	}
}

// Update the wrong letters
function updateWrongletter() {
  // Display wrong letters
  wrongLetterEle.innerHTML = `
    ${wrongLetters.length > 0 ? '<p>Wrong</p>' : ''}
    ${wrongLetters.map(letter => `<span>${letter}</span>`)}
  `;

  // Display parts
	figurePart.forEach((part, index) => {
		const errors = wrongLetters.length;

		if (index < errors) {
			part.style.display = 'block';
		} else {
			part.style.display = 'none';
		}
	});

  // Check if lost
  if (figurePart.length === wrongLetters.length) {
    showGameOver();
  }
}

// show game over popup
function showGameOver() {
  finalMessage.innerText = 'Unfortunately you lost. 😕';
  finalMessageReveal.innerText = `...the word was: ${randomWord}`;
  popupContainer.style.display = 'flex';

  playable = false;
}

// Show notification
function showNotification() {
  notificationContainer.classList.add('show');

  setTimeout(() => {
    notificationContainer.classList.remove('show');
  }, 2000);
}

// Keydown letter press
window.addEventListener('keydown', (e) => {
  if (playable) {
    if (e.keyCode >= 65 && e.keyCode <= 90) {
      const currLetter = e.key.toLowerCase();

      if (randomWord.includes(currLetter)) {
        if (correctLetters.includes(currLetter)) {
          showNotification();    
        } else {
          correctLetters.push(currLetter);

          showWord();
        }
      } else {
        if (wrongLetters.includes(currLetter)) {
          showNotification();
        } else {
          wrongLetters.push(currLetter);

          updateWrongletter();
        }
      }  
    }
  }
});

// Restart game and play again
playAgainBtn.addEventListener('click', async () => {
  playable = true;

	// Empty arrays
  correctLetters = [];
  wrongLetters = [];

  // randomWord = words[Math.floor(Math.random() * words.length)];
  randomWord = await getRandomWord();

  showWord();

  updateWrongletter();

  popupContainer.style.display = 'none';
});


(async () => {
  randomWord =  await getRandomWord();
  showWord();
})();