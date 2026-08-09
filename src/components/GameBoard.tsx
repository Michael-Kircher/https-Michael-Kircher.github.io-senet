/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Piece, Player, Move, BoardSquare } from '../types';
import { BOARD_SQUARE_DEFS } from '../utils/gameLogic';
import { motion } from 'motion/react';
import { Award, Sparkles } from 'lucide-react';

interface GameBoardProps {
  pieces: Piece[];
  currentPlayer: Player;
  validMoves: Move[];
  onSelectPiece: (pieceId: string) => void;
  theme: 'wood' | 'papyrus' | 'stone';
  isAITurn: boolean;
  isVSComputer?: boolean;
}

export default function GameBoard({
  pieces,
  currentPlayer,
  validMoves,
  onSelectPiece,
  theme,
  isAITurn,
  isVSComputer = true
}: GameBoardProps) {

  // Group pieces by positions on board
  const getPieceAtPosition = (pos: number): Piece | undefined => {
    return pieces.find(p => p.position === pos);
  };

  // Check if a piece at position can be moved
  const getMoveForPiece = (pieceId: string): Move | undefined => {
    if (isAITurn) return undefined;
    return validMoves.find(m => m.pieceId === pieceId);
  };

  // Visual grids configurations
  // Row 1: Left to right (1 to 10)
  const row1 = Array.from({ length: 10 }, (_, i) => i + 1);
  // Row 2: Right to left (11 to 20 -> reversed index)
  const row2 = Array.from({ length: 10 }, (_, i) => 20 - i);
  // Row 3: Left to right (21 to 30)
  const row3 = Array.from({ length: 10 }, (_, i) => i + 21);

  const rows = [row1, row2, row3];

  // Get Theme Classes
  const getThemeClasses = () => {
    switch (theme) {
      case 'stone':
        return {
          boardBg: 'bg-[#c8c7c3] border-[6px] border-[#2d2417] text-[#2d2417] shadow-[12px_12px_0px_#2d2417]',
          squareBg: 'bg-[#e8e7e4] border-[#2d2417] text-[#2d2417]',
          squareSpecialBg: 'bg-[#d8d7d4] border-[#2d2417] text-[#2d2417]',
          textColor: 'text-[#2d2417]'
        };
      case 'papyrus':
        return {
          boardBg: 'bg-[#eedcb4] border-[6px] border-[#2d2417] text-[#2d2417] shadow-[12px_12px_0px_#2d2417]',
          squareBg: 'bg-[#fcfaf2] border-[#2d2417] text-[#2d2417]',
          squareSpecialBg: 'bg-[#f7efd5] border-[#2d2417] text-[#2d2417]',
          textColor: 'text-[#2d2417]'
        };
      case 'wood':
      default:
        return {
          boardBg: 'bg-[#ebd8a7] border-[6px] border-[#2d2417] text-[#2d2417] shadow-[12px_12px_0px_#2d2417]',
          squareBg: 'bg-[#fff9eb] border-[#2d2417] text-[#2d2417]',
          squareSpecialBg: 'bg-[#f7efd5] border-[#2d2417] text-[#2d2417]',
          textColor: 'text-[#2d2417]'
        };
    }
  };

  const themeClasses = getThemeClasses();

  // Draw elegant custom hieroglyphs
  const renderHieroglyph = (symbol: string) => {
    switch (symbol) {
      case 'rebirth': // 15
        return (
          <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] opacity-85 text-[#2e6930]">
            {/* Ankh symbol of life/rebirth */}
            <path
              d="M 50 15 C 40 15, 35 30, 50 48 C 65 30, 60 15, 50 15 Z M 50 48 L 50 90 M 30 55 L 70 55"
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Sprouting lotus flower details */}
            <path d="M 32 85 Q 50 70 68 85" fill="none" stroke="currentColor" strokeWidth="3" />
            <path d="M 50 70 L 50 90" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        );
      case 'beauty': // 26
        return (
          <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] opacity-90 text-[#b58c14]">
            {/* Hieroglyph "Nefer" - Beauty and Goodness (Lute/windpipe) */}
            <circle cx="50" cy="27" r="12" fill="none" stroke="currentColor" strokeWidth="6" />
            <path d="M 50 39 L 50 85" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
            <path d="M 33 60 C 33 70, 40 75, 50 75 C 60 75, 67 70, 67 60 C 67 50, 60 45, 50 45 C 40 45, 33 50, 33 60 Z" fill="none" stroke="currentColor" strokeWidth="5" />
            <path d="M 38 71 L 62 71" fill="none" stroke="currentColor" strokeWidth="4" />
          </svg>
        );
      case 'water': // 27
        return (
          <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] opacity-90 text-[#1e5c8a]">
            {/* Water Waves Hieroglyph - Triple wavy lines */}
            <path d="M 15 25 Q 23 15 32 25 T 49 25 T 66 25 T 83 25" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <path d="M 15 50 Q 23 40 32 50 T 49 50 T 66 50 T 83 50" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <path d="M 15 75 Q 23 65 32 75 T 49 75 T 66 75 T 83 75" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );
      case 'three_truths': // 28
        return (
          <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] opacity-85 text-[#8a5c1e]">
            {/* Three distinct strokes linked to absolute truths of Ma'at */}
            <line x1="35" y1="20" x2="35" y2="80" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
            <line x1="50" y1="20" x2="50" y2="80" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
            <line x1="65" y1="20" x2="65" y2="80" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
            {/* Soft scale of justice overlay */}
            <path d="M 25 35 Q 50 40 75 35" fill="none" stroke="currentColor" strokeWidth="3" />
          </svg>
        );
      case 'two_reatoum': // 29
        return (
          <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] opacity-85 text-[#8a5c1e]">
            {/* Two strokes for Re-Atoum (the dual solar essence) */}
            <line x1="42" y1="20" x2="42" y2="80" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
            <line x1="58" y1="20" x2="58" y2="80" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
            {/* Sun disk above */}
            <circle cx="50" cy="15" r="5" fill="currentColor" />
          </svg>
        );
      case 'horus': // 30
        return (
          <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] opacity-90 text-[#7a1c1c]">
            {/* Classic Falcon of Horus profile representation */}
            <path d="M 28 65 Q 40 65 52 50 Q 56 45 60 30 Q 64 20 75 22 Q 68 28 64 36 Q 64 42 70 48 Q 60 52 52 65 Q 48 72 45 80 L 32 80 L 28 65" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <circle cx="61" cy="27" r="3" fill="white" />
            {/* Arrow/Line representing a single final truth stroke */}
            <line x1="50" y1="85" x2="50" y2="92" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Render Piece Shape Component
  const renderGamePiece = (piece: Piece, move?: Move) => {
    const isP1 = piece.player === 'PLAYER_1';
    
    // Cone Piece SVG representation (Ivory styling)
    if (isP1) {
      return (
        <motion.div
          key={piece.id}
          className={`w-[70%] h-[70%] relative flex items-center justify-center cursor-pointer ${
            move ? 'filter drop-shadow-[0_0_8px_rgba(251,191,36,1)]' : ''
          }`}
          whileHover={{ scale: move ? 1.25 : 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => move && onSelectPiece(piece.id)}
        >
          <svg viewBox="0 0 80 100" className="w-full h-full filter drop-shadow-md">
            {/* Shadow Base */}
            <ellipse cx="40" cy="88" rx="25" ry="8" fill="black" opacity="0.2" />
            
            {/* 3D-feeling Lapis Lazuli Cone */}
            <path
              d="M 40 10 Q 75 80 65 85 Q 40 92 15 85 Q 5 80 40 10"
              fill="url(#ivoryGrad)"
              stroke="#2d2417"
              strokeWidth="2.5"
            />
            {/* Golden Ribbon trim at base */}
            <path
              d="M 21 78 Q 40 85 59 78"
              fill="none"
              stroke="#e6d2a0"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Shining orb on top */}
            <circle cx="40" cy="11" r="5" fill="#e6d2a0" stroke="#2d2417" strokeWidth="1.5" />
            
            {/* Gradient definition */}
            <defs>
              <linearGradient id="ivoryGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8eb0c9" />
                <stop offset="50%" stopColor="#1e4a6d" />
                <stop offset="100%" stopColor="#0a2235" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      );
    } else {
      // Spool Piece SVG representation (Ebony/Wood styling)
      return (
        <motion.div
          key={piece.id}
          className={`w-[70%] h-[70%] relative flex items-center justify-center cursor-pointer ${
            move ? 'filter drop-shadow-[0_0_8px_rgba(251,191,36,1)]' : ''
          }`}
          whileHover={{ scale: move ? 1.25 : 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => move && onSelectPiece(piece.id)}
        >
          <svg viewBox="0 0 80 100" className="w-full h-full filter drop-shadow-md">
            {/* Shadow Base */}
            <ellipse cx="40" cy="88" rx="24" ry="8" fill="black" opacity="0.2" />

            {/* 3D Ebony Spool Cylinder */}
            {/* Top flange */}
            <ellipse cx="40" cy="25" rx="22" ry="7" fill="url(#ebonyTopGrad)" stroke="#4a2c14" strokeWidth="1" />
            <ellipse cx="40" cy="25" rx="14" ry="4.5" fill="#1b0e06" />

            {/* Middle shaft */}
            <path
              d="M 18 25 Q 40 32 62 25 L 56 75 Q 40 82 24 75 Z"
              fill="url(#ebonyGrad)"
              stroke="#3c200c"
              strokeWidth="1.5"
            />

            {/* Rings on the spool shaft */}
            <path d="M 21 42 Q 40 48 59 42" fill="none" stroke="#aa7a44" strokeWidth="2.5" />
            <path d="M 22 58 Q 40 64 58 58" fill="none" stroke="#aa7a44" strokeWidth="2.5" />

            {/* Bottom flange */}
            <path
              d="M 18 78 C 18 70, 62 70, 62 78 C 62 86, 18 86, 18 78"
              fill="url(#ebonyTopGrad)"
              stroke="#2e1708"
              strokeWidth="1"
            />

            {/* Gradients */}
            <defs>
              <linearGradient id="ebonyGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#d47f57" />
                <stop offset="40%" stopColor="#8b3d1b" />
                <stop offset="80%" stopColor="#4e1d08" />
                <stop offset="100%" stopColor="#2c1004" />
              </linearGradient>
              <linearGradient id="ebonyTopGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#b45a31" />
                <stop offset="100%" stopColor="#4e1d08" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      );
    }
  };

  // Get borne off stats
  const countBorneOff = (player: Player) => {
    return pieces.filter(p => p.player === player && p.position === 0).length;
  };

  const p1BorneOff = countBorneOff('PLAYER_1');
  const p2BorneOff = countBorneOff('PLAYER_2');

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto py-4">
      
      {/* Borne Off Trays (Ancient vessel trays for finished pieces) */}
      <div className="flex justify-between w-full max-w-4xl px-2.5 mb-5 md:mb-7 select-none gap-4">
        
        {/* Ivory Cones tray */}
        <div className="flex-1 max-w-[280px] bg-[#fff9eb] border-2 border-[#2d2417] p-2.5 shadow-[4px_4px_0px_#2d2417] flex flex-col items-center rounded-none">
          <span className="text-[10px] uppercase font-serif tracking-wider font-bold text-[#2d2417] flex items-center gap-1">
            𓋹 Cones Finished <span className="font-bold">({p1BorneOff}/5)</span>
          </span>
          <div className="flex justify-center items-center gap-2 h-11 mt-1.5 bg-[#f4e4bc]/30 rounded-none w-full px-2 border border-[#2d2417]">
            {Array.from({ length: 5 }).map((_, i) => (
              <div 
                key={i} 
                className={`w-7 h-7 flex items-center justify-center transition-all duration-300 ${
                  i < p1BorneOff ? 'opacity-100 scale-100' : 'opacity-15 scale-75'
                }`}
              >
                <svg viewBox="0 0 80 100" className="w-[85%] h-[85%]">
                  <path d="M 40 10 Q 75 80 65 85 Q 40 92 15 85 Q 5 80 40 10" fill="#1e4a6d" stroke="#2d2417" strokeWidth="2" />
                  <circle cx="40" cy="11" r="5" fill="#e6d2a0" />
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic status center */}
        <div className="hidden sm:flex flex-col justify-center items-center px-4 font-serif">
          <span className="text-[10px] font-mono tracking-widest text-[#2d2417] uppercase font-bold opacity-75">Active Player</span>
          <div className="flex items-center gap-2 mt-1 px-4 py-1.5 bg-[#2d2417] border-2 border-[#2d2417] shadow-[2px_2px_0px_#2d2417]">
            <div className={`w-3 h-3 rounded-full ${
              currentPlayer === 'PLAYER_1' ? 'bg-[#8eb0c9]' : 'bg-[#d47f57]'
            } animate-pulse`} />
            <span className="font-serif font-bold text-xs text-[#f4e4bc] uppercase tracking-wider">
              {currentPlayer === 'PLAYER_1' ? 'Cones (You)' : isVSComputer ? 'Spools (CPU)' : 'Spools (P2)'}
            </span>
          </div>
        </div>

        {/* Ebony Spools tray */}
        <div className="flex-1 max-w-[280px] bg-[#fff9eb] border-2 border-[#2d2417] p-2.5 shadow-[4px_4px_0px_#2d2417] flex flex-col items-center rounded-none">
          <span className="text-[10px] uppercase font-serif tracking-wider font-bold text-[#2d2417] flex items-center gap-1">
            𓅃 Spools Finished <span className="font-bold">({p2BorneOff}/5)</span>
          </span>
          <div className="flex justify-center items-center gap-2 h-11 mt-1.5 bg-[#f4e4bc]/30 rounded-none w-full px-2 border border-[#2d2417]">
            {Array.from({ length: 5 }).map((_, i) => (
              <div 
                key={i} 
                className={`w-7 h-7 flex items-center justify-center transition-all duration-300 ${
                  i < p2BorneOff ? 'opacity-100 scale-100' : 'opacity-15 scale-75'
                }`}
              >
                <svg viewBox="0 0 80 100" className="w-[85%] h-[85%]">
                  <ellipse cx="40" cy="25" rx="20" ry="6" fill="#8b3d1b" stroke="#2d2417" strokeWidth="1" />
                  <path d="M 18 25 Q 40 32 62 25 L 56 75 Q 40 82 24 75 Z" fill="#4e1d08" stroke="#2d2417" strokeWidth="1" />
                </svg>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Board Container */}
      <div className={`w-full p-4 md:p-6 rounded-none border-4 border-[#2d2417] transition-all duration-500 overflow-x-auto ${themeClasses.boardBg}`}>
        
        {/* The 3-Row Grid Grid representation */}
        <div className="min-w-[700px] flex flex-col gap-2 relative">
          
          {/* Subtle directional paths guiding vector arrows */}
          <div className="absolute top-1/6 left-0 right-0 h-0.5 border-t border-dashed border-[#2d2417]/10 pointer-events-none" />
          <div className="absolute top-1/2 left-0 right-0 h-0.5 border-t border-dashed border-[#2d2417]/10 pointer-events-none" />
          <div className="absolute top-5/6 left-0 right-0 h-0.5 border-t border-dashed border-[#2d2417]/10 pointer-events-none" />

          {rows.map((rowArr, rowIndex) => {
            return (
              <div key={rowIndex} className="grid grid-cols-10 gap-2 relative z-10">
                {rowArr.map((pos) => {
                  const squareDef = BOARD_SQUARE_DEFS[pos - 1];
                  const piece = getPieceAtPosition(pos);
                  const isSpecial = !!squareDef.symbol;
                  
                  // If there exists a valid move for this piece
                  const move = piece ? getMoveForPiece(piece.id) : undefined;
                  
                  // Determine if this cell is highlighted as a move TARGET for the currently selected piece?
                  // (We don't need a separate selection state since clicking are instantly performed because there is exactly 1 move per piece,
                  // but we can highlight possible destinations on hover to be extra polished!)
                  const isDestination = validMoves.some(m => m.to === pos && !isAITurn);

                  const cellBg = pos === 27 
                    ? 'bg-[#d9e8f5]' 
                    : isSpecial 
                    ? themeClasses.squareSpecialBg 
                    : themeClasses.squareBg;

                  return (
                    <div
                      key={pos}
                      id={`senet-square-${pos}`}
                      className={`h-20 w-full relative rounded-none flex flex-col justify-center items-center cursor-default group transition-all duration-300 ${cellBg} ${
                        isAITurn ? 'opacity-90' : ''
                      } ${
                        isDestination 
                          ? 'bg-[#fff9eb] border-[3px] border-orange-500 ring-4 ring-orange-500/50 scale-[1.03] z-20 shadow-md' 
                          : 'border-2 border-[#2d2417]'
                      }`}
                      title={squareDef.germanName + ": " + squareDef.description}
                    >
                      {/* Square Number */}
                      <span className="absolute top-1 left-2.5 text-[10px] font-mono opacity-60 font-bold select-none text-[#2d2417]">
                        {pos}
                      </span>

                      {/* Special Hieroglyph Symbol behind pieces */}
                      {squareDef.symbol && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-1.5 select-none z-0">
                          {renderHieroglyph(squareDef.symbol)}
                        </div>
                      )}

                      {/* Interactive Game Piece */}
                      {piece && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                          {renderGamePiece(piece, move)}
                        </div>
                      )}

                      {/* Path Direction Indicator lines in corner on hover */}
                      <span className="absolute bottom-1 right-2 opacity-0 group-hover:opacity-60 transition-opacity text-[8px] font-mono select-none text-[#2d2417]">
                        {rowIndex === 0 || rowIndex === 2 ? '🡒' : '🡐'}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Track Flow Guide */}
      <div className="mt-3.5 flex justify-center text-[10px] font-serif tracking-widest text-[#2d2417] uppercase gap-8 select-none font-bold">
        <span className="flex items-center gap-1">🡒 Start (Squares 1 - 10)</span>
        <span className="flex items-center gap-1">🡐 Turn (Squares 11 - 20)</span>
        <span className="flex items-center gap-1">🡒 Ascent (Squares 21 - 30)</span>
      </div>
    </div>
  );
}
