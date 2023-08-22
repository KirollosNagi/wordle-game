document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
  
    const newGameButton = document.getElementById('newGame');
    const submitGuessButton = document.getElementById('submitGuess');
    const guessInput = document.getElementById('guess');
    const resultDiv = document.getElementById('result');
  
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
    });
  
    socket.on('newTarget', (targetWord) => {
      console.log(`New target word: ${targetWord}`);
    });
  
    socket.on('win', () => {
      resultDiv.textContent = 'You win!';
    });
  
    socket.on('wrongGuess', () => {
      resultDiv.textContent = 'Wrong guess. Try again.';
    });
  
    socket.on('disconnect', () => {
      console.log('Disconnected from the server');
    });
  });
  