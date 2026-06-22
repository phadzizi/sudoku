import type { BestScore, Difficulty } from '../sudoku/sudoku.types';

function storageKey(difficulty: Difficulty): string {
  return `sudoku:best:${difficulty}`;
}

export function getBestScore(difficulty: Difficulty): BestScore | null {
  try {
    const raw = localStorage.getItem(storageKey(difficulty));
    if (!raw) return null;
    return JSON.parse(raw) as BestScore;
  } catch {
    return null;
  }
}

export function setBestScore(difficulty: Difficulty, score: number): void {
  try {
    const record: BestScore = { score, achievedAt: new Date().toISOString() };
    localStorage.setItem(storageKey(difficulty), JSON.stringify(record));
  } catch {
    // ignore write failures (e.g. private browsing storage quota)
  }
}

export function clearBestScore(difficulty: Difficulty): void {
  try {
    localStorage.removeItem(storageKey(difficulty));
  } catch {
    // ignore
  }
}
