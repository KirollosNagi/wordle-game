const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

let englishWords = [];
let availableCharacters = 'abcdefghijklmnopqrstuvwxyz';

// Load the list of English words from a text file
fs.readFile('english-words.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading wordlist.txt:', err.message);
  } else {
    englishWords = data.split('\n').map((word) => word.trim());
    console.log(`Loaded ${englishWords.length} English words`);
  }
});

let targetWord = getRandomWord();
let guesses = [];
let maxGuesses = 6;
let timer;

function getRandomWord() {
  const randomIndex = Math.floor(Math.random() * englishWords.length);
  return englishWords[randomIndex];
}

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('newGame', () => {
    targetWord = getRandomWord();
    guesses = [];
    maxGuesses = 6;
    clearInterval(timer);
    timer = startTimer(socket);
    socket.emit('newTarget', targetWord);
    availableCharacters = 'abcdefghijklmnopqrstuvwxyz';
    io.emit('updateGuesses', guesses);
    io.emit('updateCharacters', availableCharacters);
  });

  socket.on('guess', (guess) => {
    if (maxGuesses > 0) {
      guess = guess.toLowerCase().trim();
      if (guess.length === 5 && /^[a-z]+$/.test(guess)) {
        if (englishWords.includes(guess)) {
          guesses.push(guess);
          maxGuesses--;
          availableCharacters = availableCharacters.replace(new RegExp(guess.split('').join('|'), 'g'), '');
          io.emit('updateGuesses', guesses);
          io.emit('updateCharacters', availableCharacters);
          if (guess === targetWord) {
            clearInterval(timer);
            socket.emit('win');
          } else if (maxGuesses === 0) {
            clearInterval(timer);
            socket.emit('lose');
          }
        } else {
          socket.emit('unknownWord');
        }
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

function startTimer(socket) {
  let seconds = 30;
  io.emit('updateTimer', seconds);
  return setInterval(() => {
    seconds--;
    io.emit('updateTimer', seconds);
    if (seconds === 0) {
      clearInterval(timer);
      socket.emit('lose');
    }
  }, 1000);
}

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
