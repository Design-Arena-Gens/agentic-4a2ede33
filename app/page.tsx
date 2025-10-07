'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

const ROWS = 40;
const COLS = 60;

const generateEmptyGrid = () => {
  return Array(ROWS).fill(null).map(() => Array(COLS).fill(false));
};

const generateRandomGrid = () => {
  return Array(ROWS).fill(null).map(() =>
    Array(COLS).fill(null).map(() => Math.random() > 0.7)
  );
};

const countNeighbors = (grid: boolean[][], row: number, col: number) => {
  let count = 0;
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];

  for (const [dx, dy] of directions) {
    const newRow = row + dx;
    const newCol = col + dy;

    if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS) {
      if (grid[newRow][newCol]) count++;
    }
  }

  return count;
};

const computeNextGeneration = (grid: boolean[][]) => {
  const newGrid = grid.map((row, i) =>
    row.map((cell, j) => {
      const neighbors = countNeighbors(grid, i, j);

      if (cell) {
        return neighbors === 2 || neighbors === 3;
      } else {
        return neighbors === 3;
      }
    })
  );

  return newGrid;
};

export default function Home() {
  const [grid, setGrid] = useState(generateEmptyGrid);
  const [running, setRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [speed, setSpeed] = useState(100);

  const runningRef = useRef(running);
  runningRef.current = running;

  const speedRef = useRef(speed);
  speedRef.current = speed;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid(g => {
      const newGrid = computeNextGeneration(g);
      return newGrid;
    });

    setGeneration(gen => gen + 1);

    setTimeout(() => {
      runSimulation();
    }, speedRef.current);
  }, []);

  useEffect(() => {
    if (running) {
      runSimulation();
    }
  }, [running, runSimulation]);

  const toggleCell = (row: number, col: number) => {
    if (running) return;

    const newGrid = grid.map((r, i) =>
      r.map((cell, j) => (i === row && j === col ? !cell : cell))
    );
    setGrid(newGrid);
  };

  const handleStart = () => {
    setRunning(true);
  };

  const handleStop = () => {
    setRunning(false);
  };

  const handleClear = () => {
    setGrid(generateEmptyGrid());
    setGeneration(0);
    setRunning(false);
  };

  const handleRandom = () => {
    setGrid(generateRandomGrid());
    setGeneration(0);
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpeed(Number(e.target.value));
  };

  return (
    <div className="container">
      <h1 className="title">Conway&apos;s Game of Life</h1>

      <div className="controls">
        {!running ? (
          <button className="button" onClick={handleStart}>
            Start
          </button>
        ) : (
          <button className="button" onClick={handleStop}>
            Stop
          </button>
        )}
        <button className="button secondary" onClick={handleClear}>
          Clear
        </button>
        <button className="button secondary" onClick={handleRandom}>
          Random
        </button>
      </div>

      <div className="speed-control">
        <span className="speed-label">Speed:</span>
        <input
          type="range"
          min="10"
          max="500"
          value={speed}
          onChange={handleSpeedChange}
          disabled={running}
        />
        <span className="speed-label">{speed}ms</span>
      </div>

      <div className="info">
        Generation: <span className="generation">{generation}</span>
      </div>

      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${COLS}, 16px)`,
        }}
      >
        {grid.map((rows, i) =>
          rows.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              className={`cell ${cell ? 'alive' : ''}`}
              onClick={() => toggleCell(i, j)}
            />
          ))
        )}
      </div>
    </div>
  );
}
