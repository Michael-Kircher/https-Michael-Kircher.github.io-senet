/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Player = 'PLAYER_1' | 'PLAYER_2';

export interface Piece {
  id: string; // e.g., 'p1-1', 'p2-3'
  player: Player;
  position: number; // 1 to 30, or 0 if born off (finished)
  index: number; // For rendering animations stable keys
}

export type TurnPhase = 'THROW' | 'MOVE' | 'WAITING_FOR_AI' | 'GAME_OVER';

export type AIDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export type RulesVariant = 'KENDALL' | 'BELL' | 'SENEB';

export interface GameSettings {
  rulesVariant: RulesVariant;
  stopAtBeauty: boolean;         // Must land exactly on Square 26 (Per Nefer)
  blockThreeInARow: boolean;     // 3 pieces in a row block passing
  backwardIfNoForward: boolean;  // Must move backward if no forward moves are possible
  waterResetHome: boolean;       // Water resets to House of Rebirth (15), otherwise resets to 1 (or next free)
  aiDifficulty: AIDifficulty;
  isVSComputer: boolean;         // True if playing against AI
  soundEnabled: boolean;
  theme: 'wood' | 'papyrus' | 'stone';
}

export interface Move {
  pieceId: string;
  from: number;
  to: number; // 0 for borne off, 1-30 for board
  isAttack: boolean;
  attackedPieceId?: string;
  isWaterReset?: boolean;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  player: Player;
  action: 'ROLL' | 'MOVE' | 'PASS' | 'WATER_RESET' | 'REBIRTH' | 'BEAR_OFF' | 'VICTORY' | 'START';
  rollValue?: number;
  rollDetails?: boolean[]; // [flat, flat, round, round]
  moveDetails?: {
    from: number;
    to: number;
    attacked?: boolean;
  };
  message: string;
}

export interface BoardSquare {
  index: number; // 1 to 30
  name: string;
  germanName: string;
  description: string;
  isSafe: boolean;
  symbol?: string; // Icon or SVG name
}
