document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
  
    const newGameButton = document.getElementById('newGame');
    const submitGuessButton = document.getElementById('submitGuess');
    const guessInput = document.getElementById('guess');
    const resultDiv = document.getElementById('result');
    const guessesDiv = document.getElementById('guesses');
    const timerDiv = document.getElementById('timer');
    const availableCharactersSpan = document.getElementById('availableCharacters');
    let targetWord;

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
  
    socket.on('newTarget', (newtarget) => {
      targetWord = newtarget
      console.log(`New target word: ${newtarget}`);
      availableCharactersSpan.textContent = Array.from(newtarget).join(', ');
    });

    function getGuessFeedback(guess) {
        let guess2 = 'hello'
        const feedback = [];
        for (let i = 0; i < guess2.length; i++) {
          if (guess[i] == targetWord[i]) {
            feedback.push('correct');
          } else if (targetWord.includes(guess[i])) {
            feedback.push('incorrect');
          } else {
            feedback.push('unknown');
          }
        }
        return feedback;
      }
      
      function formatGuessWithFeedback(guess, feedback) {
        const formattedGuess = [];
        for (let i = 0; i < guess.length; i++) {
          let color = '';
          if (feedback[i] === 'correct') {
            color = 'green';
          } else if (feedback[i] === 'incorrect') {
            color = 'yellow';
          }
          else
          {
            color = 'black';
          }
          formattedGuess.push(`<span style="color: ${color};">${guess[i]}</span>`);
        }
        return formattedGuess.join('');
      }
      

      socket.on('updateGuesses', (guesses) => {
        const guessListContainer = document.getElementById('guesses');
        guessListContainer.innerHTML = ''; // Clear the previous list
      
        for (let i = 0; i < guesses.length; i++) {
          const guess = guesses[i];
          const feedback = getGuessFeedback(guess);
          const formattedGuess = formatGuessWithFeedback(guess, feedback);
      
          const guessItem = document.createElement('div');
          guessItem.innerHTML = `${i + 1}. ${formattedGuess}`;
          guessListContainer.appendChild(guessItem);
        }
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
  