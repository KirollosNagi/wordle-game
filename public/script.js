document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
  
    const newGameButton = document.getElementById('newGame');
    const submitGuessButton = document.getElementById('submitGuess');
    const guessInput = document.getElementById('guess');
    const resultDiv = document.getElementById('result');
    const guessesDiv = document.getElementById('guesses');
    const timerDiv = document.getElementById('timer');
    const availableCharactersSpan = document.getElementById('availableCharacters');
  
    newGameButton.addEventListener('click', () => {
      socket.emit('newGame');
      resultDiv.textContent = '';
      guessInput.value = '';
    });
  
    submitGuessButton.addEventListener('click', () => {
      const guess = guessInput.value.toLowerCase().trim();
      if (guess.length !== 5 || !/^[a-z]+$/.test(guess)) {
        alert('Invalid guess. Please enter a 5-letter word.');
        guessInput.value = '';
        return;
      }
      socket.emit('guess', guess);
      guessInput.value = '';
    });
  
    socket.on('newTarget', (targetWord) => {
      console.log(`New target word: ${targetWord}`);
      availableCharactersSpan.textContent = Array.from(targetWord).join(', ');
    });
  
    socket.on('updateGuesses', (guesses) => {
      const guessList = guesses.map((guess, index) => `<div>${index + 1}. ${guess}</div>`).join('');
      guessesDiv.innerHTML = guessList;
    });
  
    socket.on('win', () => {
      resultDiv.textContent = 'You win!';
    });
  
    socket.on('updateCharacters', (characters) => {
        availableCharactersSpan.textContent = characters;
      });
      
    socket.on('lose', () => {
      resultDiv.textContent = 'You lose. The word was ' + targetWord;
    });
  
    socket.on('unknownWord', () => {
      alert('Unknown word. Please enter a valid English word.');
    });
  
    socket.on('updateTimer', (seconds) => {
      timerDiv.textContent = `Time left: ${seconds} seconds`;
    });
  
    socket.on('disconnect', () => {
      console.log('Disconnected from the server');
    });
  });
  