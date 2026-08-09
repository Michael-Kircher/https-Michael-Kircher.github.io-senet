/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Piece, Player, Move, GameSettings } from '../types';
import { isPieceDefended, isBlockedByThreeInARow, BOARD_SQUARE_DEFS, getWaterResetPosition } from './gameLogic';

/**
 * AI Decision Maker for Senet.
 * Chooses the best move from the list of valid moves.
 */
export function chooseAIMove(
  validMoves: Move[],
  aiPlayer: Player,
  pieces: Piece[],
  settings: GameSettings
): Move | null {
  if (validMoves.length === 0) return null;

  // Easy mode: Choose completely at random
  if (settings.aiDifficulty === 'EASY') {
    const randomIndex = Math.floor(Math.random() * validMoves.length);
    return validMoves[randomIndex];
  }

  const opponent: Player = aiPlayer === 'PLAYER_1' ? 'PLAYER_2' : 'PLAYER_1';

  // Evaluate each move to calculate a score
  const scoredMoves = validMoves.map(move => {
    let score = 0;

    // 1. Core Actions
    if (move.to === 0) {
      // Bearing off is always the highest priority!
      score += 1500;
    }

    if (move.isAttack) {
      // Attacks are extremely disruptive and valuable
      score += 350;

      // Extra bonus if we attack a piece that is quite far advanced
      const attackedPiece = pieces.find(p => p.id === move.attackedPieceId);
      if (attackedPiece) {
        score += attackedPiece.position * 5;
      }
    }

    // 2. Square Safety & Hazards
    if (move.to === 27) {
      // Falling into the House of Water is almost always bad
      // Calculate where we would reset
      const resetPos = getWaterResetPosition(pieces);
      if (resetPos < move.from) {
        // We lose ground
        score -= 250;
      } else {
        // Paradoxically, if resetPos is ahead (rare but possible in initial blockages), it might not be terrible
        score -= 50;
      }
    }

    const targetSquareDef = BOARD_SQUARE_DEFS[move.to - 1];
    if (targetSquareDef?.isSafe) {
      // Landing on safe squares is great!
      score += 80;
    }

    // 3. Positional progress
    // Advancing pieces is generally good
    const progress = move.to - move.from;
    score += progress * 1.5; 

    // Give higher priority to moving pieces that are further back to bring them forward
    // OR prioritize pushing the leader forward. Let's balance:
    // Pushing leaders forward helps bear off.
    score += move.to * 1.5;

    // 4. Team Synergy (Defensive positioning)
    // Simulate board after this move to evaluate defense
    const nextPiecesState = pieces.map(p => {
      if (p.id === move.pieceId) {
        return { ...p, position: move.to };
      }
      if (move.isAttack && p.id === move.attackedPieceId) {
        return { ...p, position: move.from }; // Swapped
      }
      return p;
    });

    const isNowDefended = isPieceDefended(move.to, aiPlayer, nextPiecesState);
    if (isNowDefended) {
      // Creating adjacent pieces is awesome
      score += 120;
    }

    // Did we leave any piece undefended?
    // Let's check our old position. If it was defending someone else, and now they are vulnerable:
    const friendlyAdjacentToOld = pieces.some(p => p.player === aiPlayer && (p.position === move.from - 1 || p.position === move.from + 1));
    if (friendlyAdjacentToOld) {
      // Leaving a friend alone might make them vulnerable
      score -= 30;
    }

    // Check if we created or extended a 3-in-a-row block
    let blockCount = 0;
    for (let pos = 1; pos <= 28; pos++) {
      const f1 = nextPiecesState.some(p => p.player === aiPlayer && p.position === pos);
      const f2 = nextPiecesState.some(p => p.player === aiPlayer && p.position === pos + 1);
      const f3 = nextPiecesState.some(p => p.player === aiPlayer && p.position === pos + 2);
      if (f1 && f2 && f3) {
        blockCount++;
      }
    }
    score += blockCount * 150; // High value on blocks since they shut down opponent!

    // 5. Escaping Danger
    // If the piece was vulnerable at `from` (opponent could attack it with reasonable throws 1-5)
    // and now it is safe, add a bonus
    const opponentPieces = pieces.filter(p => p.player === opponent && p.position > 0);
    const couldBeAttackedAtOld = opponentPieces.some(opp => {
      const dist = move.from - opp.position;
      return dist >= 1 && dist <= 5; // Direct line of fire
    });
    
    if (couldBeAttackedAtOld && !isPieceDefended(move.from, aiPlayer, pieces)) {
      // We were in danger! Moving out of danger is a smart escape
      score += 90;
    }

    // Fine-tune with difficulty elements
    if (settings.aiDifficulty === 'MEDIUM') {
      // Add a tiny bit of random noise so it isn't 100% predictable
      score += (Math.random() - 0.5) * 50;
    } else if (settings.aiDifficulty === 'HARD') {
      // Predict opponent counter opportunities
      // Does this move land us right in front of an opponent piece (1 to 5 squares ahead)?
      // If it lands on a non-safe square, and opponent has a piece that can hit us:
      if (!targetSquareDef?.isSafe && !isNowDefended) {
        const landingInLineOfFire = opponentPieces.some(opp => {
          const dist = move.to - opp.position;
          return dist >= 1 && dist <= 5;
        });
        if (landingInLineOfFire) {
          score -= 75; // Penalize risk
        }
      }
    }

    return { move, score };
  });

  // Sort moves by score descending
  scoredMoves.sort((a, b) => b.score - a.score);

  // Return the best scored move
  return scoredMoves[0].move;
}
