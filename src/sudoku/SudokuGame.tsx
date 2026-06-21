import { useState } from 'react';
import { useParams } from 'react-router-dom';
import GameLayout from '../components/GameLayout';
import { loadPuzzle } from './sudoku.logic';
import type { CellState, Difficulty } from './sudoku.types';
import styles from './SudokuGame.module.css';

function toDifficulty(s: string | undefined): Difficulty {
  if (s === 'medium' || s === 'hard') return s;
  return 'easy';
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
  const [board] = useState<CellState[][]>(() => loadPuzzle(toDifficulty(difficulty)).board);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);

  const [sr, sc] = selectedCell ?? [-1, -1];
  const selectedValue = selectedCell ? board[sr][sc].value : 0;

  return (
    <GameLayout>
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
                onClick={() => setSelectedCell([r, c])}
                aria-invalid={cell.error}
                aria-pressed={isSelected}
                aria-label={`Row ${r + 1}, column ${c + 1}${cell.value ? `, ${cell.value}` : ''}`}
              >
                {cell.value !== 0 ? cell.value : ''}
              </button>
            );
          })
        )}
      </div>
    </GameLayout>
  );
}
