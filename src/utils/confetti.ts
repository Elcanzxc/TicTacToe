import confetti from 'canvas-confetti';
import { Player } from '../types';

export function fireVictoryConfetti(winner: Player) {
  const colors = winner === 'X' 
    ? ['#00f0ff', '#38bdf8', '#0284c7', '#ffffff'] 
    : ['#ff0055', '#f43f5e', '#fb7185', '#ffffff'];

  try {
    // Left burst
    confetti({
      particleCount: 45,
      angle: 60,
      spread: 55,
      origin: { x: 0.1, y: 0.7 },
      colors,
      disableForReducedMotion: true,
    });

    // Right burst
    confetti({
      particleCount: 45,
      angle: 120,
      spread: 55,
      origin: { x: 0.9, y: 0.7 },
      colors,
      disableForReducedMotion: true,
    });
  } catch {
    // Fallback if canvas is unavailable
  }
}

