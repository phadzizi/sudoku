export type Difficulty = 'easy' | 'medium' | 'hard';

export type GameStatus = 'idle' | 'playing' | 'paused' | 'complete';

export type Board = number[][];

export type CellState = {
  value: number;
  given: boolean;
  notes: number[];
  error: boolean;
};

export type GameState = {
  status: GameStatus;
  difficulty: Difficulty;
  board: CellState[][];
  solution: Board;
  selectedCell: [number, number] | null;
  elapsedSeconds: number;
  mistakes: number;
  hintsUsed: number;
};

export type SavedGame = {
  board: CellState[][];
  solution: Board;
  elapsedSeconds: number;
  mistakes: number;
  hintsUsed: number;
  undoStack: CellState[][][];
};

export type BestScore = {
  score: number;
  achievedAt: string;
};

export type Puzzle = {
  clues: string;
  solution: string;
};

export type Rng = () => number;
