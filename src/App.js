import { useEffect, useState } from "react";
import "./App.css";

const winBoard = (board) => {
  const winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of winningLines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return board.includes(null) ? null : "D";
};

function Cell({ value, index, clickHandler, miniboardIndex, isValid }) {
  return (
    <button
      className={`game-cell ${isValid ? "valid" : ""}`}
      onClick={() => clickHandler(index, miniboardIndex)}
    >
      {value}
    </button>
  );
}

function MiniBoard({ miniState, handler, miniBoardIndex, validMiniBoard }) {
  const winner = winBoard(miniState);
  if (winner) {
    return (
      <div className={`miniboard miniboard-winner ${winner}-color`}>{winner}</div>
    );
  }

  return (
    <div className="miniboard">
      {generateRows(3).map((row) => (
        <div className="miniboard-row" key={row}>
          {generateRows(3).map((col) => {
            const cellIndex = row * 3 + col;
            return (
              <Cell
                key={cellIndex}
                value={miniState[cellIndex]}
                index={cellIndex}
                clickHandler={handler}
                miniboardIndex={miniBoardIndex}
                isValid={validMiniBoard}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

function GameBoard({ state, moveHandler, validMiniBoards }) {
  return (
    <div className="gameboard">
      {generateRows(3).map((row) => (
        <div className="gameboard-row" key={row}>
          {generateRows(3).map((col) => {
            const miniBoardIndex = row * 3 + col;
            return (
              <MiniBoard
                key={miniBoardIndex}
                miniBoardIndex={miniBoardIndex}
                miniState={state[miniBoardIndex]}
                handler={moveHandler}
                validMiniBoard={validMiniBoards.includes(miniBoardIndex)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [miniGameState, setMiniGameState] = useState(
    Array.from({ length: 9 }, () => Array(9).fill(null))
  );
  const [validMiniBoards, setValidMiniBoards] = useState(
    Array.from({ length: 9 }, (_, index) => index)
  );
  const [currentTurn, setCurrentTurn] = useState("X");
  const [gameState, setGameState] = useState(Array(9).fill(null));
  // const [miniStats, setMiniStats] = useState({ X: 0, O: 0, D: 0 });
  const [stats, setStats] = useState({ X: 0, O: 0, D: 0 });
  const [status, setStatus] = useState("Next to move: X");

  useEffect(() => {
    const winner = winBoard(gameState);
    if (winner) {
      setStatus(winner === "D" ? "Game Drawn" : `Winner: ${winner}`);
      setStats((prevStats) => ({
        ...prevStats,
        [winner]: prevStats[winner] + 1,
      }));
      setValidMiniBoards([]);
    } else {
      setStatus(`Next to move: ${currentTurn}`);
    }
  }, [gameState, currentTurn]);

  const resetGame = () => {
    setMiniGameState(Array.from({ length: 9 }, () => Array(9).fill(null)));
    setValidMiniBoards(Array.from({ length: 9 }, (_, index) => index));
    setCurrentTurn("X");
    setGameState(Array(9).fill(null));
    // setMiniStats({ X: 0, O: 0, D: 0 });
    setStatus("Next to move: X");
  };

  const moveHandler = (cellIndex, miniBoardIndex) => {
    const newMiniGameState = miniGameState.map((board) => [...board]);

    if (
      !validMiniBoards.includes(miniBoardIndex) ||
      newMiniGameState[miniBoardIndex][cellIndex] ||
      !status.includes("Next")
    ) {
      return;
    }

    newMiniGameState[miniBoardIndex][cellIndex] = currentTurn;

    const miniBoardResult = winBoard(newMiniGameState[miniBoardIndex]);
    if (miniBoardResult) {
      newMiniGameState[miniBoardIndex] = Array(9).fill(miniBoardResult);
      setGameState((prev) => {
        const newGameState = [...prev];
        newGameState[miniBoardIndex] = miniBoardResult;
        return newGameState;
      });

      // setMiniStats((prevStats) => ({
      //   ...prevStats,
      //   [miniBoardResult]: prevStats[miniBoardResult] + 1,
      // }));
    }

    const nextValidBoards =
      newMiniGameState[cellIndex].includes(null)
        ? [cellIndex]
        : newMiniGameState
            .map((board, idx) => (board.includes(null) ? idx : null))
            .filter((idx) => idx !== null);

    setMiniGameState(newMiniGameState);
    setValidMiniBoards(nextValidBoards);
    setCurrentTurn(currentTurn === "X" ? "O" : "X");
  };

  return (
    <div className="background">
      <div className="game-container">
        <div className="game-title">Super Tic-Tac-Toe</div>
        <GameBoard
          state={miniGameState}
          moveHandler={moveHandler}
          validMiniBoards={validMiniBoards}
        />
      </div>
      <div className="menu-bar">
        <div className="info-card">
          <div className="card-title">Menu</div>
          <div className="card-entry">{status}</div>
          {/* <div className="card-entry">X mini-wins: {miniStats["X"]}</div> */}
          {/* <div className="card-entry">O mini-wins: {miniStats["O"]}</div> */}
          {/* <div className="card-entry">mini-Draws: {miniStats["D"]}</div> */}
          <div className="card-entry">X wins: {stats["X"]}</div>
          <div className="card-entry">O wins: {stats["O"]}</div>
          <div className="card-entry">Draws: {stats["D"]}</div>
          <button className="card-button" onClick={resetGame}>
            New Game
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper function
const generateRows = (count) => Array.from({ length: count }, (_, index) => index);
