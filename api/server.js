const express = require('express');
const stockfish = require('stockfish');
const engine = stockfish();
const fenregex = /^([rnbqkpRNBQKP1-8]+\/){7}[rnbqkpRNBQKP1-8]+\s[bw]\s(-|K?Q?k?q?)\s(-|[a-h][36])\s(0|[1-9][0-9]*)\s([1-9][0-9]*)$/;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

engine.onmessage = function(msg) {
  console.log(msg);
};

engine.postMessage('uci');

// Test endpoint
app.get('/test', (req, res) => {
  res.send('Server is running correctly');
});

app.post('/', (request, response) => {
  if (!request.body.fen.match(fenregex)) {
    response.send('Invalid fen string');
    return;
  }
  
  let bestEvaluation = null;

  engine.onmessage = function(msg) {
    console.log(msg);
    if (typeof msg === 'string') {
      if (msg.includes('info depth')) {
        const evalMatch = msg.match(/score cp (-?\d+)/);
        if (evalMatch) {
          const cpScore = parseInt(evalMatch[1], 10);
          const score = (Math.abs(cpScore) / 100.0).toFixed(2);
          bestEvaluation = cpScore > 0 ? `${score}` : cpScore < 0 ? `-${score}` : '0.00';
        }
      } else if (msg.includes('bestmove')) {
        if (bestEvaluation !== null) {
          response.send(bestEvaluation);
        } else {
          response.send('No evaluation available');
        }
      }
    }
  };

  engine.postMessage('ucinewgame');
  engine.postMessage('position fen ' + request.body.fen);
  engine.postMessage('go depth 20');
});

module.exports = app;