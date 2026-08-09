/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Piece, Player, GameSettings, Move, BoardSquare } from '../types';

export const BOARD_SQUARE_DEFS: BoardSquare[] = Array.from({ length: 30 }, (_, i) => {
  const index = i + 1;
  let name = `Square ${index}`;
  let germanName = `Square ${index}`;
  let description = `A normal board square.`;
  let isSafe = false;
  let symbol: string | undefined = undefined;

  if (index === 15) {
    name = "House of Rebirth";
    germanName = "House of Rebirth";
    description = "Resurrection point for pieces that drowned in the water. This is a safe square.";
    isSafe = true;
    symbol = "rebirth";
  } else if (index === 26) {
    name = "House of Beauty";
    germanName = "House of Beauty";
    description = "The favorable entry point for the final row. All pieces must stop here before moving further down. This is a safe square.";
    isSafe = true;
    symbol = "beauty";
  } else if (index === 27) {
    name = "House of Water";
    germanName = "House of Water";
    description = "A trap! Landing here drowns your piece in the Nile, resetting it to the House of Rebirth (Square 15).";
    isSafe = false;
    symbol = "water";
  } else if (index === 28) {
    name = "House of the Three Truths";
    germanName = "House of the Three Truths";
    description = "A safe square. Requires an exact throw of 3 to bear off.";
    isSafe = true;
    symbol = "three_truths";
  } else if (index === 29) {
    name = "House of the Two Re-Atoum";
    germanName = "House of the Two Re-Atoum";
    description = "A safe square. Requires an exact throw of 2 to bear off.";
    isSafe = true;
    symbol = "two_reatoum";
  } else if (index === 30) {
    name = "House of Horus";
    germanName = "House of Horus";
    description = "The final square, protected by the falcon god Horus. Requires an exact throw of 1 to bear off.";
    isSafe = true;
    symbol = "horus";
  }

  return { index, name, germanName, description, isSafe, symbol };
});

/**
 * Checks if a piece is defended by one or more adjacent friendly pieces.
 * In Senet, 2 or more adjacent friendly pieces of the same color defend each other.
 */
export function isPieceDefended(pos: number, player: Player, pieces: Piece[]): boolean {
  if (pos < 1 || pos > 30) return false;
  
  // Find friendly neighbors
  const friendlyAtPrev = pieces.some(p => p.player === player && p.position === pos - 1);
  const friendlyAtNext = pieces.some(p => p.player === player && p.position === pos + 1);

  return friendlyAtPrev || friendlyAtNext;
}

/**
 * Checks if there is a block of 3 or more consecutive opponent pieces that cannot be jumped over.
 */
export function isBlockedByThreeInARow(from: number, to: number, movingPlayer: Player, pieces: Piece[]): boolean {
  const opponent = movingPlayer === 'PLAYER_1' ? 'PLAYER_2' : 'PLAYER_1';
  
  const start = Math.min(from, to);
  const end = Math.max(from, to);

  // We search for a block of 3 consecutive opponent pieces anywhere between starting and ending positions.
  // The block must reside fully inside the path (cannot start before 'start' or end after 'end' if we only care about jumping over it).
  // Actually, standard rule: if there are 3 consecutive opponent pieces, you cannot jump over them.
  // So, are they blocking the gap?
  // Let's check all start points for blocks of 3
  for (let k = 1; k <= 28; k++) {
    const opp1 = pieces.some(p => p.player === opponent && p.position === k);
    const opp2 = pieces.some(p => p.player === opponent && p.position === k + 1);
    const opp3 = pieces.some(p => p.player === opponent && p.position === k + 2);

    if (opp1 && opp2 && opp3) {
      // We found an active opponent block at {k, k+1, k+2}
      // Does our move "jump over" this block?
      // Jumping over means we start at or before k-1, and end at or after k+3.
      // If our destination is inside the block, it's already blocked because they defend each other (since 3 in a row is defended).
      // So we only restrict moves that strictly pass the block:
      if (from <= k && to >= k + 3) {
        return true;
      }
      if (from >= k + 3 && to <= k) { // For backward moves
        return true;
      }
    }
  }

  return false;
}

/**
 * Determines the next position on a water reset or if the rebirth position is blocked.
 * Water reset target is normally 15. If 15 is occupied:
 * - By own piece: go back to first available square starting from 1.
 * - By enemy piece: swap? No, standard is: go back to first available square starting from 1.
 */
export function getWaterResetPosition(pieces: Piece[]): number {
  const REBIRTH_POS = 15;
  const isOccupied = pieces.some(p => p.position === REBIRTH_POS);
  if (!isOccupied) {
    return REBIRTH_POS;
  }

  // Find first unoccupied square starting from 1
  for (let pos = 1; pos <= 30; pos++) {
    if (pos === 27) continue; // Don't reset back into the water!
    const occupied = pieces.some(p => p.position === pos);
    if (!occupied) {
      return pos;
    }
  }

  return 1; // Fallback
}

/**
 * Calculates all valid moves for a player given their piece state and thrown roll.
 */
export function getValidMoves(player: Player, roll: number, pieces: Piece[], settings: GameSettings): Move[] {
  const playerPieces = pieces.filter(p => p.player === player && p.position > 0);
  const validMoves: Move[] = [];

  for (const piece of playerPieces) {
    const from = piece.position;
    
    // --- FORWARD MOVE ATTEMPT ---
    let to = from + roll;

    // A piece can be borne off (made past 30)
    const canBearOffDirectly = (from >= 26); // Usually only pieces on the last row can bear off

    if (to > 30) {
      if (canBearOffDirectly) {
        // Bear-off rules:
        // Square 28 (Three Truths): requires exactly 3 (to reaches 31)
        // Square 29 (Two Re-Atoum): requires exactly 2 (to reaches 31)
        // Square 30 (Horus): requires exactly 1 (to reaches 31)
        // Square 26 (House of Beauty): can bear off directly with a 5? Or must pass through?
        // Let's implement exact bear off (reaches exactly 31)
        const isExactBearOff = (to === 31);
        
        if (isExactBearOff) {
          // Check if there are other pieces back on the board.
          // In some strict rules of Senet, you cannot bear off any pieces until all your pieces have reached the last row (row 3, fields 21-30).
          // This adds high strategy! Let's check this constraint:
          const allOtherPiecesOnLastRow = pieces
            .filter(p => p.player === player && p.position > 0)
            .every(p => p.position >= 21);

          if (allOtherPiecesOnLastRow) {
            validMoves.push({
              pieceId: piece.id,
              from,
              to: 0, // 0 represents borne off
              isAttack: false
            });
          }
        }
      }
      continue; // Can't move forward beyond 30 unless it's an exact bear off
    }

    // Check mandatory stop at House of Beauty (Square 26)
    if (settings.stopAtBeauty && from < 26 && to > 26) {
      // Piece is before 26 and path would overshoot 26.
      // Move is invalid because piece MUST land exactly on 26.
      continue;
    }

    // Check if three-in-a-row blocks the path
    if (settings.blockThreeInARow && isBlockedByThreeInARow(from, to, player, pieces)) {
      continue;
    }

    // Check destination square
    const targetPiece = pieces.find(p => p.position === to);

    if (!targetPiece) {
      // Empty square - valid!
      // Wait, is it House of Water (27)?
      // Landing on 27 is valid, but results in immediate reset. We'll handle visual reset in the move application,
      // but let's label it so UI/Engine knows
      validMoves.push({
        pieceId: piece.id,
        from,
        to,
        isAttack: false,
        isWaterReset: (to === 27)
      });
    } else if (targetPiece.player === player) {
      // Occupied by friendly piece - cannot land here.
      continue;
    } else {
      // Occupied by enemy piece - can we attack?
      // Safe squares cannot be attacked: 15, 26, 28, 29, 30 are safe
      const targetSquareDef = BOARD_SQUARE_DEFS[to - 1];
      const isTargetSafe = targetSquareDef?.isSafe || false;

      if (!isTargetSafe) {
        // Is the enemy piece defended?
        const defended = isPieceDefended(to, targetPiece.player, pieces);
        if (!defended) {
          // Valid swap attack!
          validMoves.push({
            pieceId: piece.id,
            from,
            to,
            isAttack: true,
            attackedPieceId: targetPiece.id
          });
        }
      }
    }
  }

  // If no forward moves are available, check backward moves if rule is enabled
  if (validMoves.length === 0 && settings.backwardIfNoForward) {
    for (const piece of playerPieces) {
      const from = piece.position;
      const to = from - roll;

      if (to >= 1) { // Must stay on board
        // No jumping over 3-in-a-row backward either
        if (settings.blockThreeInARow && isBlockedByThreeInARow(from, to, player, pieces)) {
          continue;
        }

        const targetPiece = pieces.find(p => p.position === to);
        if (!targetPiece) {
          // Backward moves cannot be attacks, only onto empty squares
          validMoves.push({
            pieceId: piece.id,
            from,
            to,
            isAttack: false,
            // Can a backward move land on water? (Though unlikely to move backward to 27 since you start before 26)
            isWaterReset: (to === 27)
          });
        }
      }
    }
  }

  return validMoves;
}

/**
 * Prepares initial state for pieces.
 * 5 pieces for player 1, 5 pieces for player 2.
 * Placed alternatingly on squares 1 to 10.
 */
export function createInitialPieces(): Piece[] {
  const pieces: Piece[] = [];
  
  // Placed alternatingly on squares 1 to 10:
  // p1 at 1, p2 at 2, p1 at 3, p2 at 4, etc.
  for (let i = 0; i < 5; i++) {
    pieces.push({
      id: `p1-${i + 1}`,
      player: 'PLAYER_1',
      position: (i * 2) + 1, // 1, 3, 5, 7, 9
      index: i
    });
    
    pieces.push({
      id: `p2-${i + 1}`,
      player: 'PLAYER_2',
      position: (i * 2) + 2, // 2, 4, 6, 8, 10
      index: i + 5
    });
  }

  return pieces;
}

/**
 * Calculates throws based on 4 casting sticks.
 * Each stick has flat (true) or round/dark (false) side.
 * Throws values:
 * 1 flat up = 1 (bonus turn)
 * 2 flat up = 2
 * 3 flat up = 3
 * 4 flat up = 4 (bonus turn)
 * 0 flat up = 5 (bonus turn)
 */
export function throwSticks(): { value: number; sticks: boolean[]; isExtraThrow: boolean } {
  // Generate random values for 4 sticks
  const sticks = [
    Math.random() < 0.5,
    Math.random() < 0.5,
    Math.random() < 0.5,
    Math.random() < 0.5,
  ];

  const flatCount = sticks.filter(s => s).length;
  
  let value = flatCount;
  if (flatCount === 0) {
    value = 5;
  }

  const isExtraThrow = (value === 1 || value === 4 || value === 5);

  return { value, sticks, isExtraThrow };
}
