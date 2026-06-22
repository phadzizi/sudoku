import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameLayout from '../components/GameLayout';
import { clearSavedGame, getSavedGame } from '../services/storage';
import type { Difficulty } from '../sudoku/sudoku.types';
import styles from './HomePage.module.css';

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];
const LABELS: Record<Difficulty, string> = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };

export default function HomePage() {
  const navigate = useNavigate();

  const [saves, setSaves] = useState<Record<Difficulty, boolean>>(() => ({
    easy: getSavedGame('easy') !== null,
    medium: getSavedGame('medium') !== null,
    hard: getSavedGame('hard') !== null,
  }));
  const [prompt, setPrompt] = useState<Difficulty | null>(null);

  function handleDifficultyClick(d: Difficulty) {
    if (saves[d]) {
      setPrompt((prev) => (prev === d ? null : d));
    } else {
      navigate(`/game/${d}`);
    }
  }

  function handleResume(d: Difficulty) {
    navigate(`/game/${d}`);
  }

  function handleNewGame(d: Difficulty) {
    clearSavedGame(d);
    setSaves((prev) => ({ ...prev, [d]: false }));
    setPrompt(null);
    navigate(`/game/${d}`);
  }

  return (
    <GameLayout>
      <div className={styles.page}>
        <h1 className={styles.title}>Sudoku</h1>
        <div className={styles.difficultyList}>
          {DIFFICULTIES.map((d) => (
            <div key={d}>
              <button
                className={styles.difficultyBtn}
                onClick={() => handleDifficultyClick(d)}
                data-testid={`difficulty-${d}`}
              >
                {LABELS[d]}
                {saves[d] && (
                  <span className={styles.resumeBadge} data-testid={`resume-badge-${d}`}>
                    Resume
                  </span>
                )}
              </button>
              {prompt === d && (
                <div className={styles.resumePrompt} data-testid={`resume-prompt-${d}`}>
                  <p className={styles.resumePromptLabel}>Continue your {LABELS[d]} game?</p>
                  <div className={styles.resumePromptActions}>
                    <button
                      className={styles.resumeBtn}
                      data-testid={`resume-btn-${d}`}
                      onClick={() => handleResume(d)}
                    >
                      Resume
                    </button>
                    <button
                      className={styles.newGameBtn}
                      data-testid={`new-game-btn-${d}`}
                      onClick={() => handleNewGame(d)}
                    >
                      New game
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </GameLayout>
  );
}
