/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';

interface CastingSticksProps {
  values: boolean[]; // true = flat (white/cream), fals = round (dark wood)
  resultValue: number | null;
  isRolling: boolean;
  onCast: () => void;
  disabled: boolean;
  activePlayerName: string;
}

export default function CastingSticks({
  values,
  resultValue,
  isRolling,
  onCast,
  disabled,
  activePlayerName
}: CastingSticksProps) {
  // Translate result values into readable words and bonuses
  const getCastLabel = (val: number) => {
    switch (val) {
      case 1: return { name: "Achet (1)", desc: "Extra turn!", color: "text-green-700 bg-green-50/80" };
      case 2: return { name: "Senet (2)", desc: "Normal turn", color: "text-amber-800 bg-amber-50/80" };
      case 3: return { name: "Chemet (3)", desc: "Normal turn", color: "text-amber-800 bg-amber-50/80" };
      case 4: return { name: "Fedu (4)", desc: "Extra turn!", color: "text-green-700 bg-green-50/80" };
      case 5: return { name: "Diwa (5)", desc: "Extra turn!", color: "text-green-700 bg-green-50/80" };
      default: return null;
    }
  };

  const labelDetails = resultValue !== null ? getCastLabel(resultValue) : null;

  return (
    <div className="bg-[#ebd8a7] text-[#2d2417] border-4 border-[#2d2417] shadow-[6px_6px_0px_#2d2417] rounded-none p-5 w-full max-w-sm flex flex-col items-center">
      <h3 className="text-xs font-serif font-bold tracking-widest text-[#2d2417] uppercase mb-4 flex items-center gap-1.5">
        <span className="text-sm font-normal select-none">𓂀</span> Throw Casting Sticks
      </h3>

      {/* 4 Sticks Row */}
      <div className="flex gap-4 items-center justify-center py-5 h-32 w-full select-none">
        {values.map((isFlat, i) => {
          // Add subtle authentic rotational offset from the design HTML style to give a hand-crafted wood look
          const staticRot = i === 0 ? '-5deg' : i === 1 ? '2deg' : i === 2 ? '-2deg' : '4deg';
          return (
            <div key={i} className="perspective-1000 w-8 h-28 relative">
              <motion.div
                className="w-full h-full preserve-3d relative cursor-pointer"
                animate={{
                  rotateY: isRolling ? [0, 360, 720, 1080] : isFlat ? 0 : 180,
                  y: isRolling ? [0, -40, -10, -50, 0] : 0,
                  rotateZ: isRolling ? [0, 15, -15, 30, 0] : 0,
                }}
                transition={{
                  duration: isRolling ? 0.8 : 0.4,
                  ease: isRolling ? "easeInOut" : "easeOut",
                }}
                style={{ rotate: isRolling ? undefined : staticRot }}
              >
                {/* FLAT SIDE (Creamy Ivory/Wood with solid graphic markings) */}
                <div 
                  className="absolute inset-0 backface-hidden rounded-none border-2 border-[#2d2417] shadow-sm flex flex-col justify-around items-center p-1 bg-[#e6d2a0]"
                  style={{ transform: 'rotateY(0deg)' }}
                >
                  <div className="w-1.5 h-1/5 bg-[#2d2417]/30 rounded-none" />
                  <div className="flex flex-col gap-1 items-center">
                    <div className="w-3 h-3 border border-[#2d2417] rounded-full flex items-center justify-center text-[7px] text-[#2d2417] font-bold">𓁹</div>
                    <div className="w-1 h-3 bg-[#2d2417]/50 rounded-none" />
                  </div>
                  <div className="w-1.5 h-1/5 bg-[#2d2417]/30 rounded-none" />
                </div>

                {/* ROUNDED SIDE (Artistic Dark Mahogany) */}
                <div 
                  className="absolute inset-0 backface-hidden rounded-none border-2 border-[#2d2417] shadow-sm flex flex-col justify-between items-center py-2 bg-[#2d2417]"
                  style={{ transform: 'rotateY(180deg)' }}
                >
                  {/* Subtle wood lines using the ivory styling */}
                  <div className="w-[2px] h-[80%] bg-[#e6d2a0]/40 rounded-none" />
                  <div className="absolute w-[2px] h-3 bg-[#e6d2a0]/20 rounded-none left-2 top-6" />
                  <div className="absolute w-[2px] h-4 bg-[#e6d2a0]/20 rounded-none right-2 bottom-6" />
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Result Value */}
      <div className="h-14 flex items-center justify-center w-full my-1">
        {resultValue !== null && !isRolling ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`px-4 py-2 rounded-none border-2 border-[#2d2417] text-center font-serif shadow-[3px_3px_0px_#2d2417] bg-[#fff9eb] ${labelDetails?.color || 'text-[#2d2417]'}`}
          >
            <div className="text-sm font-bold tracking-wide uppercase">{labelDetails?.name}</div>
            <div className="text-[10px] font-sans tracking-tight font-semibold opacity-90">{labelDetails?.desc}</div>
          </motion.div>
        ) : isRolling ? (
          <span className="text-xs font-serif italic text-[#2d2417] animate-pulse">Casting sticks rattling...</span>
        ) : (
          <span className="text-[10px] text-[#2d2417]/60 font-serif italic text-center px-4">
            Cast the sticks to determine your moves.
          </span>
        )}
      </div>

      {/* Cast Action Button */}
      <button
        onClick={onCast}
        disabled={disabled || isRolling}
        className={`w-full py-3 mt-3 tracking-wider font-bold font-serif text-[#f4e4bc] rounded-none border-2 border-[#2d2417] transition-all duration-150 transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#2d2417] flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_#2d2417] uppercase text-xs ${
          disabled || isRolling
            ? 'bg-[#2d2417]/15 text-[#2d2417]/50 border-[#2d2417]/20 cursor-not-allowed shadow-none active:translate-none'
            : 'bg-[#2d2417] hover:bg-[#4a3b26]'
        }`}
      >
        <span className="translate-y-[-1px]">Cast sticks</span>
        <span className="text-[9px] font-mono font-light text-[#f4e4bc]/80">
          ({activePlayerName})
        </span>
      </button>
    </div>
  );
}
