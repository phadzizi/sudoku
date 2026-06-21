import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'co.za.xquiz.sudoku',
  appName: 'sudoku',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
