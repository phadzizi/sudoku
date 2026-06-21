import type { ReactNode } from 'react';
import styles from './GameLayout.module.css';

export default function GameLayout({ children }: { children: ReactNode }) {
  return <div className={styles.layout}>{children}</div>;
}
