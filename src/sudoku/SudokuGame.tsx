import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GameLayout from '../components/GameLayout';
import { clearSavedGame, getBestScore, getSavedGame, setBestScore as storeBestScore, setSavedGame } from '../services/storage';
import {
  applyHint,
  calculateScore,
  isBoardComplete,
  loadPuzzle,
  setCellValue,
  toggleNote,
  validateBoard,
} from './sudoku.logic';
import type { BestScore, Board, CellState, Difficulty } from './sudoku.types';
import styles from './SudokuGame.module.css';

function toDifficulty(s: string | undefined): Difficulty {
  if (s === 'medium' || s === 'hard') return s;
  return 'easy';
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function renderCellContent(cell: CellState) {
  if (cell.value !== 0) return cell.value;
  if (cell.notes.length === 0) return null;
  return (
    <div className={styles.notes}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
        <span key={n} className={styles.note}>
          {cell.notes.includes(n) ? n : null}
        </span>
      ))}
    </div>
  );
}

function cellClassName(
  cell: CellState,
  isSelected: boolean,
  isPeer: boolean,
  isSameValue: boolean,
  row: number,
  col: number
): string {
  return [
    styles.cell,
    cell.given && styles.given,
    !cell.given && cell.value !== 0 && styles.userFilled,
    cell.error && styles.error,
    isSelected && styles.selected,
    !isSelected && isPeer && styles.peer,
    !isSelected && !isPeer && isSameValue && styles.sameValue,
    (col === 2 || col === 5) && styles.boxRight,
    (row === 2 || row === 5) && styles.boxBottom,
    col === 8 && styles.lastCol,
    row === 8 && styles.lastRow,
  ]
    .filter(Boolean)
    .join(' ');
}

export default function SudokuGame() {
  const { difficulty } = useParams<{ difficulty: string }>();
  const navigate = useNavigate();
  const diff = toDifficulty(difficulty);

  // Initialise from a saved game if one exists, otherwise start fresh
  const [init] = useState<{
    board: CellState[][];
    solution: Board;
    elapsedSeconds: number;
    mistakes: number;
    hintsUsed: number;
    undoStack: CellState[][][];
  }>(() => {
    const saved = getSavedGame(diff);
    if (saved) return saved;
    const { board, solution } = loadPuzzle(diff);
    return { board, solution, elapsedSeconds: 0, mistakes: 0, hintsUsed: 0, undoStack: [] };
  });

  const [solution] = useState<Board>(init.solution);
  const [board, setBoard] = useState<CellState[][]>(init.board);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [notesMode, setNotesMode] = useState(false);
  const [undoStack, setUndoStack] = useState<CellState[][][]>(init.undoStack);
  const [mistakes, setMistakes] = useState(init.mistakes);
  const [hintsUsed, setHintsUsed] = useState(init.hintsUsed);
  const [elapsedSeconds, setElapsedSeconds] = useState(init.elapsedSeconds);
  const [isComplete, setIsComplete] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [isNewBest, setIsNewBest] = useState(false);
  const [bestRecord, setBestRecord] = useState<BestScore | null>(() => getBestScore(diff));

  const timerStartedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Stable refs for values read inside debounced save / completion callbacks
  const initElapsedRef = useRef(init.elapsedSeconds);
  const isMountedRef = useRef(false);
  const elapsedSecondsRef = useRef(elapsedSeconds);
  elapsedSecondsRef.current = elapsedSeconds;

  // Auto-start timer on mount when resuming an in-progress game;
  // also cleans up the interval on unmount.
  useEffect(() => {
    if (initElapsedRef.current > 0 && !timerStartedRef.current) {
      timerStartedRef.current = true;
      timerRef.current = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []); // all accessed variables are refs — stable, no deps needed

  const startTimer = useCallback(() => {
    if (timerStartedRef.current) return;
    timerStartedRef.current = true;
    timerRef.current = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
  }, []);

  // Updated each render so handlers always close over the latest state values
  const handleCompletionRef = useRef<() => void>(() => {});
  handleCompletionRef.current = () => {
    // Cancel any pending debounced save before clearing
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    clearSavedGame(diff);
    const score = calculateScore(diff, elapsedSeconds, mistakes, hintsUsed);
    setFinalScore(score);
    setIsComplete(true);
    const current = getBestScore(diff);
    if (current === null || score > current.score) {
      storeBestScore(diff, score);
      setBestRecord({ score, achievedAt: new Date().toISOString() });
      setIsNewBest(true);
    }
  };

  // Auto-save after every cell change, debounced 500ms.
  // Skip the initial mount fire (board hasn't changed yet).
  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      return;
    }
    if (isComplete) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      setSavedGame(diff, {
        board,
        solution,
        elapsedSeconds: elapsedSecondsRef.current,
        mistakes,
        hintsUsed,
        undoStack,
      });
    }, 500);
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [board, mistakes, hintsUsed, undoStack, isComplete, diff, solution]);

  // Derived — used for button disabled states and highlight logic
  const [sr, sc] = selectedCell ?? [-1, -1];
  const sel = selectedCell ? board[sr][sc] : null;
  const canPick = sel !== null && !sel.given;
  const canHint = sel !== null && !sel.given && sel.value !== solution[sr][sc];
  const selectedValue = sel?.value ?? 0;

  const pick = useCallback(
    (num: number) => {
      if (!selectedCell) return;
      const [row, col] = selectedCell;
      const cell = board[row][col];
      if (cell.given) return;

      if (num === 0) {
        if (cell.value === 0 && cell.notes.length === 0) return;
        const cleared = board.map((r, ri) =>
          ri === row
            ? r.map((c, ci) => (ci === col ? { ...c, value: 0, notes: [], error: false } : c))
            : r
        );
        setUndoStack((s) => [...s, board]);
        setBoard(validateBoard(cleared));
        return;
      }

      if (notesMode) {
        setUndoStack((s) => [...s, board]);
        setBoard(toggleNote(board, row, col, num));
      } else {
        if (cell.value === num) return;
        const next = validateBoard(setCellValue(board, row, col, num));
        setUndoStack((s) => [...s, board]);
        setBoard(next);
        if (num !== solution[row][col]) {
          setMistakes((m) => m + 1);
        }
        if (isBoardComplete(next)) handleCompletionRef.current();
      }
    },
    [selectedCell, board, notesMode, solution]
  );

  const undo = useCallback(() => {
    if (undoStack.length === 0) return;
    setBoard(undoStack[undoStack.length - 1]);
    setUndoStack((s) => s.slice(0, -1));
  }, [undoStack]);

  const hint = useCallback(() => {
    if (!selectedCell) return;
    const [row, col] = selectedCell;
    const cell = board[row][col];
    if (cell.given) return;
    if (cell.value === solution[row][col]) return;
    const next = validateBoard(applyHint(board, solution, row, col));
    setUndoStack((s) => [...s, board]);
    setBoard(next);
    setHintsUsed((h) => h + 1);
    if (isBoardComplete(next)) handleCompletionRef.current();
  }, [selectedCell, board, solution]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        startTimer();
        setSelectedCell((prev) => {
          if (!prev) return [0, 0];
          const [r, c] = prev;
          if (e.key === 'ArrowUp') return [Math.max(0, r - 1), c];
          if (e.key === 'ArrowDown') return [Math.min(8, r + 1), c];
          if (e.key === 'ArrowLeft') return [r, Math.max(0, c - 1)];
          return [r, Math.min(8, c + 1)];
        });
        return;
      }
      if (e.key >= '1' && e.key <= '9') {
        pick(parseInt(e.key, 10));
        return;
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        pick(0);
        return;
      }
      if (e.key === 'n') {
        setNotesMode((m) => !m);
        return;
      }
      if (e.key === 'z') {
        e.preventDefault();
        undo();
        return;
      }
      if (e.key === 'h') {
        hint();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [startTimer, pick, undo, hint]);

  if (isComplete) {
    return (
      <GameLayout>
        <div className={styles.completeScreen} data-testid="game-complete-screen">
          <h2 className={styles.completeTitle}>{isNewBest ? 'New Best!' : 'Puzzle Complete!'}</h2>
          <div className={styles.completeStats}>
            <div className={styles.completeStat}>
              <span className={styles.completeStatLabel}>Time</span>
              <span className={styles.completeStatValue}>{formatTime(elapsedSeconds)}</span>
            </div>
            <div className={styles.completeStat}>
              <span className={styles.completeStatLabel}>Score</span>
              <span
                className={`${styles.completeStatValue}${isNewBest ? ` ${styles.newBestValue}` : ''}`}
              >
                {finalScore}
              </span>
            </div>
            <div className={styles.completeStat}>
              <span className={styles.completeStatLabel}>Mistakes</span>
              <span className={styles.completeStatValue}>{mistakes}</span>
            </div>
            <div className={styles.completeStat}>
              <span className={styles.completeStatLabel}>Hints</span>
              <span className={styles.completeStatValue}>{hintsUsed}</span>
            </div>
            {bestRecord && (
              <div className={styles.completeStat}>
                <span className={styles.completeStatLabel}>Best score</span>
                <span className={styles.completeStatValue}>{bestRecord.score}</span>
              </div>
            )}
          </div>
          <div className={styles.completeActions}>
            <button className={styles.primaryBtn} onClick={() => navigate(0)}>
              Play Again
            </button>
            <button className={styles.secondaryBtn} onClick={() => navigate('/')}>
              Change Difficulty
            </button>
          </div>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout>
      {/* Board */}
      <div className={styles.board} data-testid="sudoku-board">
        {board.flatMap((row, r) =>
          row.map((cell, c) => {
            const isSelected = r === sr && c === sc;
            const isPeer =
              selectedCell !== null &&
              !isSelected &&
              (r === sr ||
                c === sc ||
                (Math.floor(r / 3) === Math.floor(sr / 3) &&
                  Math.floor(c / 3) === Math.floor(sc / 3)));
            const isSameValue = !isSelected && selectedValue !== 0 && cell.value === selectedValue;

            return (
              <button
                key={`${r}-${c}`}
                className={cellClassName(cell, isSelected, isPeer, isSameValue, r, c)}
                data-testid={`cell-${r}-${c}`}
                onClick={() => {
                  startTimer();
                  setSelectedCell([r, c]);
                }}
                aria-invalid={cell.error}
                aria-pressed={isSelected}
                aria-label={`Row ${r + 1}, column ${c + 1}${cell.value ? `, ${cell.value}` : ''}`}
              >
                {renderCellContent(cell)}
              </button>
            );
          })
        )}
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        {/* Stats */}
        <div className={styles.stats}>
          <span>
            <span className={styles.statLabel}>Time </span>
            <span className={styles.statValue} data-testid="timer-display">
              {formatTime(elapsedSeconds)}
            </span>
          </span>
          <span>
            <span className={styles.statLabel}>Mistakes </span>
            <span className={styles.statValue} data-testid="mistake-counter">
              {mistakes}
            </span>
          </span>
          <span>
            <span className={styles.statLabel}>Hints </span>
            <span className={styles.statValue} data-testid="hint-counter">
              {hintsUsed}
            </span>
          </span>
        </div>

        {/* Action bar */}
        <div className={styles.actionBar}>
          <button
            className={`${styles.actionBtn}${notesMode ? ` ${styles.actionBtnActive}` : ''}`}
            data-testid="notes-toggle"
            onClick={() => setNotesMode((m) => !m)}
            aria-pressed={notesMode}
          >
            Notes
          </button>
          <button
            className={styles.actionBtn}
            data-testid="undo-button"
            onClick={undo}
            disabled={undoStack.length === 0}
          >
            Undo
          </button>
          <button
            className={styles.actionBtn}
            data-testid="hint-button"
            onClick={hint}
            disabled={!canHint}
          >
            Hint
          </button>
        </div>

        {/* Number picker */}
        <div className={styles.picker}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <button
              key={n}
              className={styles.pickerBtn}
              data-testid={`pick-${n}`}
              onClick={() => pick(n)}
              disabled={!canPick}
            >
              {n}
            </button>
          ))}
          <button
            className={styles.pickerBtn}
            data-testid="pick-erase"
            onClick={() => pick(0)}
            disabled={!canPick}
          >
            ✕
          </button>
        </div>
      </div>
    </GameLayout>
  );
}
