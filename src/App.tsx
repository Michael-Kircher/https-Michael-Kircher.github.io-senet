/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Player, Piece, TurnPhase, GameSettings, LogEntry, Move } from './types';
import {
  createInitialPieces,
  throwSticks,
  getValidMoves,
  getWaterResetPosition,
  BOARD_SQUARE_DEFS
} from './utils/gameLogic';
import { chooseAIMove } from './utils/ai';
import {
  playMoveSound,
  playCaptureSound,
  playWaterSound,
  playRebirthSound,
  playCastSound,
  playWinSound,
  playClickSound
} from './utils/soundEffects';

import GameBoard from './components/GameBoard';
import CastingSticks from './components/CastingSticks';
import GameSettingsComponent from './components/GameSettings';
import GameLogs from './components/GameLogs';
import RulesModal from './components/RulesModal';

import { HelpCircle, RefreshCw, Volume2, VolumeX, Eye, BookOpen, User, ShieldAlert, Sparkles, Award } from 'lucide-react';
import { motion } from 'motion/react';

// Get a formatted timestamp
function getTimestamp(): string {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
}

const DEFAULT_SETTINGS: GameSettings = {
  rulesVariant: 'KENDALL',
  stopAtBeauty: true,
  blockThreeInARow: true,
  backwardIfNoForward: true,
  waterResetHome: true,
  aiDifficulty: 'MEDIUM',
  isVSComputer: true,
  soundEnabled: true,
  theme: 'wood'
};

export default function App() {
  // --- Game States ---
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('PLAYER_1');
  const [turnPhase, setTurnPhase] = useState<TurnPhase>('THROW');
  const [sticksValues, setSticksValues] = useState<boolean[]>([true, true, false, false]);
  const [sticksResult, setSticksResult] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [validMoves, setValidMoves] = useState<Move[]>([]);
  
  const [gameStateActive, setGameStateActive] = useState<boolean>(false);
  const [winner, setWinner] = useState<Player | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  
  // Modals / Overlays
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);

  // Initialize a new game
  const initGame = (customSettings?: GameSettings) => {
    const activeSettings = customSettings || settings;
    const initialPieces = createInitialPieces();
    
    setPieces(initialPieces);
    setCurrentPlayer('PLAYER_1');
    setTurnPhase('THROW');
    setSticksResult(null);
    setSticksValues([true, true, false, false]);
    setValidMoves([]);
    setWinner(null);
    setGameStateActive(true);

    const startMsg: LogEntry = {
      id: Math.random().toString(),
      timestamp: getTimestamp(),
      player: 'PLAYER_1',
      action: 'START',
      message: `May the ritual game of Senet begin! Ruleset: ${activeSettings.rulesVariant}. ${
        activeSettings.isVSComputer
          ? `Against the Egyptian AI (${
              activeSettings.aiDifficulty === 'EASY'
                ? 'Apprentice'
                : activeSettings.aiDifficulty === 'MEDIUM'
                ? 'Priest'
                : 'Pharaoh'
            })`
          : 'Local two-player game (Pass & Play)'
      }`
    };
    
    setLogs([startMsg]);
    playRebirthSound(activeSettings.soundEnabled);
  };

  // Run on mount once to pre-load a game state
  useEffect(() => {
    initGame(DEFAULT_SETTINGS);
  }, []);

  // AI Opponent Effect Loop
  useEffect(() => {
    if (!gameStateActive || winner || !settings.isVSComputer || currentPlayer === 'PLAYER_1') {
      return;
    }

    // It's the AI's turn!
    if (turnPhase === 'THROW') {
      // AI rolls casting sticks after a beautiful brief delay
      const aiRollTimer = setTimeout(() => {
        handleCastSticks();
      }, 1200);
      return () => clearTimeout(aiRollTimer);
    }

    if (turnPhase === 'MOVE') {
      // AI chooses their best calculated move
      const aiMoveTimer = setTimeout(() => {
        const selectedMove = chooseAIMove(validMoves, 'PLAYER_2', pieces, settings);
        
        if (selectedMove) {
          executeMove(selectedMove);
        } else {
          // If no moves, skip AI turn (should have been captured by throw logic, but safe fallback)
          setLogs(prev => [
            ...prev,
            {
              id: Math.random().toString(),
              timestamp: getTimestamp(),
              player: 'PLAYER_2',
              action: 'PASS',
              message: "The Hieroglyphic AI finds no valid moves and passes!"
            }
          ]);
          switchTurnAndPhase(false);
        }
      }, 1500);
      return () => clearTimeout(aiMoveTimer);
    }
  }, [currentPlayer, turnPhase, gameStateActive, winner, settings.isVSComputer, validMoves]);


  // Helper: Switch turn or continue extra turn
  const switchTurnAndPhase = (isExtraThrow: boolean, updatedPieces: Piece[] = pieces) => {
    // Check Victory condition!
    const activePlayerPieces = updatedPieces.filter(p => p.player === currentPlayer);
    const allOff = activePlayerPieces.every(p => p.position === 0);

    if (allOff) {
      setWinner(currentPlayer);
      setTurnPhase('GAME_OVER');
      playWinSound(settings.soundEnabled);
      setLogs(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          timestamp: getTimestamp(),
          player: currentPlayer,
          action: 'VICTORY',
          message: `𓎛𓎛𓎛 VICTORY OF THE SOUL! ${
            currentPlayer === 'PLAYER_1' ? 'Cones (You)' : 'Spools (Opponent)'
          } has guided all 5 pieces into the eternal afterlife and won the game!`
        }
      ]);
      return;
    }

    // No victory yet -> continue game flow
    if (isExtraThrow) {
      setTurnPhase('THROW');
      setSticksResult(null);
      setValidMoves([]);
      // Log extra throw notification
      setLogs(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          timestamp: getTimestamp(),
          player: currentPlayer,
          action: 'ROLL',
          message: `${
            currentPlayer === 'PLAYER_1' ? 'Cones' : 'Spools'
          } receives an extra throw and remains on turn!`
        }
      ]);
    } else {
      const nextPlayer = currentPlayer === 'PLAYER_1' ? 'PLAYER_2' : 'PLAYER_1';
      setCurrentPlayer(nextPlayer);
      setTurnPhase('THROW');
      setSticksResult(null);
      setValidMoves([]);
    }
  };

  // Cast sticks triggers rolling
  const handleCastSticks = () => {
    if (isRolling || winner) return;

    playCastSound(settings.soundEnabled);
    setIsRolling(true);

    // Dynamic timeout for cinematic rolling sensation
    setTimeout(() => {
      const result = throwSticks();
      setSticksResult(result.value);
      setSticksValues(result.sticks);
      setIsRolling(false);

      // Compute valid moves immediately
      const calculated = getValidMoves(currentPlayer, result.value, pieces, settings);
      
      const pName = currentPlayer === 'PLAYER_1' ? 'Cones' : 'Spools';
      const throwMsg = `${pName} rolls a ${result.value} (${result.sticks.map(s => s ? 'F' : 'R').join('')})`;

      if (calculated.length === 0) {
        // Player got a throw, but has NO valid moves anywhere on board!
        setLogs(prev => [
          ...prev,
          {
            id: Math.random().toString(),
            timestamp: getTimestamp(),
            player: currentPlayer,
            action: 'PASS',
            message: `${throwMsg}. No moves possible! Turn passes.`
          }
        ]);
        // Instantly forfeit turn
        setTimeout(() => {
          switchTurnAndPhase(false);
        }, 1200);
      } else {
        // Has moves, advance to move selection
        setValidMoves(calculated);
        setTurnPhase('MOVE');
        setLogs(prev => [
          ...prev,
          {
            id: Math.random().toString(),
            timestamp: getTimestamp(),
            player: currentPlayer,
            action: 'ROLL',
            rollValue: result.value,
            rollDetails: result.sticks,
            message: `${throwMsg}. Select a glowing piece.`
          }
        ]);
      }
    }, 800);
  };

  // Perform a specific valid move instruction
  const executeMove = (move: Move) => {
    // Determine target pieces
    const currentMovingPiece = pieces.find(p => p.id === move.pieceId);
    if (!currentMovingPiece) return;

    let updatedPieces = [...pieces];
    const playerLabel = currentPlayer === 'PLAYER_1' ? 'Cones' : 'Spools';
    const opponentLabel = currentPlayer === 'PLAYER_1' ? 'Spools' : 'Cones';

    let moveLogs: string[] = [];

    // 1. Is it a swap attack?
    if (move.isAttack) {
      updatedPieces = updatedPieces.map(p => {
        if (p.id === move.pieceId) {
          return { ...p, position: move.to };
        }
        if (p.id === move.attackedPieceId) {
          return { ...p, position: move.from }; // Swap backwards!
        }
        return p;
      });
      playCaptureSound(settings.soundEnabled);
      moveLogs.push(
        `${playerLabel} captures ${opponentLabel} on square ${move.to} and sends them back to square ${move.from}!`
      );
    } 
    // 2. Is it bearing off?
    else if (move.to === 0) {
      updatedPieces = updatedPieces.map(p => {
        if (p.id === move.pieceId) {
          return { ...p, position: 0 }; // borne off
        }
        return p;
      });
      playRebirthSound(settings.soundEnabled);
      moveLogs.push(
        `🏆 ${playerLabel} leaves the board from square ${move.from} and attains divine favor in the afterlife!`
      );
    }
    // 3. Normal move or potential trap water landing
    else {
      updatedPieces = updatedPieces.map(p => {
        if (p.id === move.pieceId) {
          return { ...p, position: move.to };
        }
        return p;
      });
      
      playMoveSound(settings.soundEnabled);
      moveLogs.push(`${playerLabel} advances from square ${move.from} to ${move.to}.`);

      // Landing in water (Square 27)?
      if (move.to === 27) {
        // Instantly drench piece and reset!
        const resetTarget = getWaterResetPosition(updatedPieces);
        
        updatedPieces = updatedPieces.map(p => {
          if (p.id === move.pieceId) {
            return { ...p, position: resetTarget };
          }
          return p;
        });

        // Trigger water drench sound and update logs
        setTimeout(() => {
          playWaterSound(settings.soundEnabled);
        }, 300);

        const resetLabel = resetTarget === 15 
          ? "House of Rebirth (Square 15)" 
          : `the first free square (Square ${resetTarget})`;

        moveLogs.push(
          `🌊 Ouch! ${playerLabel} drowns in the Nile and re-incarnates on the ${resetLabel}!`
        );
      }
    }

    // Commit state
    setPieces(updatedPieces);

    // Build collective turn logged entries
    const finalLogs: LogEntry[] = moveLogs.map((msg, idx) => ({
      id: `${Math.random()}-${idx}`,
      timestamp: getTimestamp(),
      player: currentPlayer,
      action: move.to === 0 ? 'BEAR_OFF' : move.to === 27 ? 'WATER_RESET' : 'MOVE',
      message: msg
    }));

    setLogs(prev => [...prev, ...finalLogs]);

    // Check if player receives another turn (sticksResult === 1, 4, or 5)
    const isExtraThrow = (sticksResult === 1 || sticksResult === 4 || sticksResult === 5);
    
    // Switch or continue turn
    switchTurnAndPhase(isExtraThrow, updatedPieces);
  };

  const handlePieceSelected = (pieceId: string) => {
    const move = validMoves.find(m => m.pieceId === pieceId);
    if (move) {
      executeMove(move);
    }
  };

  // Handle setting updates
  const handleSettingsChange = (newSettings: GameSettings) => {
    setSettings(newSettings);
    // Restart automatic simulation if toggled midway
    if (newSettings.isVSComputer !== settings.isVSComputer || newSettings.rulesVariant !== settings.rulesVariant) {
      initGame(newSettings);
    }
  };

  const getActiveThemeClass = () => {
    switch (settings.theme) {
      case 'stone':
        return 'bg-[#e0dfdc] text-[#2d2417]';
      case 'papyrus':
        return 'bg-[#fcf8ef] text-[#2d2417]';
      case 'wood':
      default:
        return 'bg-[#f4e4bc] text-[#2d2417]';
    }
  };

  return (
    <div className={`min-h-screen pb-0 transition-colors duration-500 font-serif ${getActiveThemeClass()} border-8 border-[#2d2417]`}>
      
      {/* Decorative Egyptian Top Bar */}
      <header className="bg-[#ebd8a7] border-b-4 border-[#2d2417] py-4 px-6 md:px-12 relative overflow-hidden select-none">
        
        {/* Decorative vector artifacts */}
        <div className="absolute top-0 bottom-0 left-4 text-[#2d2417]/10 flex items-center font-mono text-2xl tracking-widest pointer-events-none">
          𓊠𓈓 𓉐𓄤 𓉐𓈗
        </div>
        <div className="absolute top-0 bottom-0 right-4 text-[#2d2417]/10 flex items-center font-mono text-2xl tracking-widest pointer-events-none">
          𓅃𓋹𓁹
        </div>

        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 relative z-10 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#fff9eb] border-2 border-[#2d2417] shadow-[2px_2px_0px_#2d2417]">
              <span className="text-2xl" id="applet-avatar">𓂀</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold opacity-70 block">The Game of Passing</span>
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-[#2d2417] leading-none">
                Senet
              </h1>
              <span className="text-[8px] sm:text-[9px] font-sans font-bold tracking-widest text-[#2d2417]/80 block uppercase mt-1">
                Created by Malon Mischief
              </span>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap justify-center">
            <button
              onClick={() => setIsRulesOpen(true)}
              className="flex items-center gap-1.5 bg-[#fff9eb] hover:bg-[#ebd8a7] text-[#2d2417] font-serif font-bold py-2 px-4 border-2 border-[#2d2417] shadow-[3px_3px_0px_#2d2417] hover:shadow-[1px_1px_0px_#2d2417] active:translate-x-[2px] active:translate-y-[2px] transition-all text-sm cursor-pointer"
            >
              <BookOpen className="w-4 h-4" /> Rules
            </button>
            <button
              onClick={() => initGame()}
              className="flex items-center gap-1.5 bg-[#2d2417] hover:bg-[#4a3b26] text-[#f4e4bc] font-serif font-bold py-2 px-4 border-2 border-[#2d2417] shadow-[3px_3px_0px_#2d2417] hover:shadow-[1px_1px_0px_#2d2417] active:translate-x-[2px] active:translate-y-[2px] transition-all text-sm cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" /> New Game
            </button>
          </div>
        </div>
      </header>

      {/* Main Core Layout Bento Grid */}
      <main className="max-w-7xl mx-auto px-4 mt-6 md:mt-10">
        
        {/* Playmode Select Banner - artistic flair */}
        <div className="mb-6 bg-[#fff9eb] border-4 border-[#2d2417] p-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-[6px_6px_0px_#2d2417]" id="opponent-mode-selector">
          <div className="flex items-center gap-3">
            <div className="text-left">
              <p className="text-[10px] uppercase font-bold tracking-widest text-[#2d2417]/70 font-sans">Choose Opponent • Game Mode</p>
              <h3 className="font-bold text-sm uppercase tracking-tight text-[#2d2417]">Artificial Intelligence or Human Opponent?</h3>
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5 items-center">
            <button
              id="mode-solo-ai"
              onClick={() => handleSettingsChange({ ...settings, isVSComputer: true })}
              className={`flex items-center gap-1.5 px-4 py-2 border-2 border-[#2d2417] text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                settings.isVSComputer
                  ? 'bg-[#2d2417] text-[#f4e4bc] shadow-[2px_2px_0px_#2d2417] translate-x-[-1px] translate-y-[-1px]'
                  : 'bg-[#fff9eb] text-[#2d2417] hover:bg-[#ebd59e]'
              }`}
            >
              <span>🤖 AI Opponent (Solo)</span>
            </button>
            <button
              id="mode-local-2p"
              onClick={() => handleSettingsChange({ ...settings, isVSComputer: false })}
              className={`flex items-center gap-1.5 px-4 py-2 border-2 border-[#2d2417] text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                !settings.isVSComputer
                  ? 'bg-[#2d2417] text-[#f4e4bc] shadow-[2px_2px_0px_#2d2417] translate-x-[-1px] translate-y-[-1px]'
                  : 'bg-[#fff9eb] text-[#2d2417] hover:bg-[#ebd59e]'
              }`}
            >
              <span>👥 Play Partner (2P)</span>
            </button>
            
            {/* Quick difficulty select if AI is active */}
            {settings.isVSComputer && (
              <div className="flex items-center gap-1 ml-2 pl-2 border-l-2 border-[#2d2417]/20">
                <select
                  value={settings.aiDifficulty}
                  onChange={(e) => handleSettingsChange({ ...settings, aiDifficulty: e.target.value as any })}
                  className="bg-[#fff9eb] border-2 border-[#2d2417] px-2 py-1 text-[11px] font-serif font-bold text-[#2d2417] outline-none rounded-none cursor-pointer"
                  title="AI Difficulty"
                >
                  <option value="EASY">AI: Apprentice</option>
                  <option value="MEDIUM">AI: Priest</option>
                  <option value="HARD">AI: Pharaoh</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Game Active Screens */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Board Col - takes 8 grids on large views */}
          <div className="lg:col-span-8 flex flex-col justify-start">
            <GameBoard
              pieces={pieces}
              currentPlayer={currentPlayer}
              validMoves={turnPhase === 'MOVE' ? validMoves : []}
              onSelectPiece={handlePieceSelected}
              theme={settings.theme}
              isAITurn={settings.isVSComputer && currentPlayer === 'PLAYER_2'}
              isVSComputer={settings.isVSComputer}
            />


          </div>

          {/* Controls Box Col - takes 4 grids on large views */}
          <aside className="lg:col-span-4 flex flex-col gap-6 justify-between bg-[#ebd8a7] border-4 border-[#2d2417] p-6 shadow-[8px_8px_0px_#2d2417]">
            {/* Action Box: Casting Sticks */}
            <div className="flex justify-center w-full">
              <CastingSticks
                values={sticksValues}
                resultValue={sticksResult}
                isRolling={isRolling}
                onCast={handleCastSticks}
                disabled={
                  turnPhase !== 'THROW' ||
                  isRolling ||
                  winner !== null ||
                  (settings.isVSComputer && currentPlayer === 'PLAYER_2')
                }
                activePlayerName={
                  currentPlayer === 'PLAYER_1' 
                    ? 'Player (Cones)' 
                    : settings.isVSComputer 
                    ? 'Hieroglyphic AI' 
                    : 'Player 2 (Spools)'
                }
              />
            </div>

            {/* Game Chronik scroll feed */}
            <div className="flex-1 w-full min-h-[250px] lg:min-h-0">
              <GameLogs logs={logs} soundEnabled={settings.soundEnabled} />
            </div>

            {/* Small Settings Controller widget */}
            <div className="w-full flex justify-center">
              <GameSettingsComponent
                settings={settings}
                onChange={handleSettingsChange}
                onOpenRules={() => setIsRulesOpen(true)}
                onRestart={() => initGame()}
              />
            </div>

          </aside>

        </div>

      </main>

      {/* Footer credits representation */}
      <footer className="mt-16 h-14 bg-[#2d2417] text-[#f4e4bc] flex items-center px-6 md:px-12 text-[10px] uppercase tracking-[0.25em] font-serif">
        <span>Revelation • Strategy • Eternity • Judgment</span>
        <span className="ml-auto opacity-60 hidden sm:inline">Duat System v1.0.4</span>
      </footer>

      {/* Rules dialog modal widget */}
      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />

    </div>
  );
}
