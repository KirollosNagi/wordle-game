const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

const words = ['apple', 'banana', 'cherry', 'grape', 'lemon']; // Sample list of words
let targetWord = getRandomWord();

function getRandomWord() {
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
}

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('newGame', () => {
    targetWord = getRandomWord();
    socket.emit('newTarget', targetWord);
  });

  socket.on('guess', (guess) => {
    if (guess === targetWord) {
      socket.emit('win');
    } else {
      socket.emit('wrongGuess');
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
