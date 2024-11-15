import React, { useState } from "react";
import { Box, Button, Grid, Typography, Switch, FormControlLabel } from "@mui/material";

const App = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [vsAI, setVsAI] = useState(false); // Toggle for Player vs AI mode

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    calculateWinner(newBoard);

    if (vsAI && !isXNext && !winner) {
      setTimeout(() => makeAIMove(newBoard), 500); // AI makes a move after 500ms
    } else {
      setIsXNext(!isXNext);
    }
  };

  const makeAIMove = (newBoard) => {
    const emptyIndices = newBoard
      .map((value, index) => (value === null ? index : null))
      .filter((value) => value !== null);

    if (emptyIndices.length === 0) return;

    const randomMove = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    newBoard[randomMove] = "O";
    setBoard(newBoard);
    calculateWinner(newBoard);
    setIsXNext(true);
  };

  const calculateWinner = (board) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let line of lines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        setScores((prevScores) => ({
          ...prevScores,
          [board[a]]: prevScores[board[a]] + 1,
        }));
        return;
      }
    }

    if (!board.includes(null)) {
      setWinner("Draw");
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  const resetScores = () => {
    setScores({ X: 0, O: 0 });
    resetGame();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#282c34",
        color: "#ffffff",
        p: 2,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Tic-Tac-Toe
      </Typography>
      <FormControlLabel
        control={
          <Switch
            checked={vsAI}
            onChange={(e) => {
              setVsAI(e.target.checked);
              resetGame();
            }}
          />
        }
        label="Player vs AI"
        sx={{ mb: 2 }}
      />
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">
          X Score: {scores.X} | O Score: {scores.O}
        </Typography>
        <Typography variant="h6">
          {winner
            ? winner === "Draw"
              ? "It's a Draw!"
              : `Winner: ${winner}`
            : `Next Player: ${isXNext ? "X" : "O"}`}
        </Typography>
      </Box>
      <Grid container spacing={1} sx={{ width: 210, mb: 2 }}>
        {board.map((value, index) => (
          <Grid item xs={4} key={index}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                height: 70,
                fontSize: 24,
                backgroundColor: value ? "#3f51b5" : "#616161",
              }}
              onClick={() => handleClick(index)}
              disabled={vsAI && !isXNext && !winner} // Prevent user from clicking during AI's turn
            >
              {value}
            </Button>
          </Grid>
        ))}
      </Grid>
      <Button
        variant="contained"
        sx={{ mr: 2, backgroundColor: "#f50057" }}
        onClick={resetGame}
      >
        Reset Game
      </Button>
      <Button
        variant="contained"
        sx={{ backgroundColor: "#007aff" }}
        onClick={resetScores}
      >
        Reset Scores
      </Button>
    </Box>
  );
};

export default App;
