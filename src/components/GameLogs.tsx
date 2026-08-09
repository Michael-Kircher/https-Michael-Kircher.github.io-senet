/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { Scroll, Compass, ArrowRight, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GameLogsProps {
  logs: LogEntry[];
  soundEnabled: boolean;
}

export default function GameLogs({ logs }: GameLogsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-[#fff9eb] border-4 border-[#2d2417] p-4 shadow-[6px_6px_0px_#2d2417] h-full max-h-[340px] flex flex-col w-full font-serif text-[#2d2417] relative overflow-hidden rounded-none">
      {/* Decorative background lines to make it look like a scroll */}
      <div className="absolute top-0 bottom-0 left-2 w-[1px] bg-[#2d2417]/5 pointer-events-none" />
      <div className="absolute top-0 bottom-0 left-3 w-[1px] bg-[#2d2417]/5 pointer-events-none" />

      <h3 className="font-serif font-bold text-sm text-[#2d2417] flex items-center gap-1.5 border-b-2 border-[#2d2417] pb-1.5 mb-2.5 uppercase tracking-wider">
        <Scroll className="w-4 h-4 text-[#2d2417]" /> Chronicle of the Soul
      </h3>

      {/* Log list viewport */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-amber-200"
      >
        {logs.length === 0 ? (
          <div className="text-xs text-stone-400 italic text-center py-8">
            No events recorded. Let the game begin!
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {logs.map((log) => {
              // Custom icon/color markers depending on type
              let markerColor = "bg-stone-300";
              let textColor = "text-[#4a3621]";

              if (log.action === 'VICTORY') {
                markerColor = "bg-amber-500 ring-2 ring-amber-300";
                textColor = "text-amber-900 font-bold bg-amber-100/50 p-1.5 rounded-md border border-amber-200";
              } else if (log.action === 'ROLL') {
                markerColor = "bg-[#c5a872]";
                textColor = "text-stone-700 text-xs";
              } else if (log.action === 'MOVE') {
                markerColor = log.player === 'PLAYER_1' ? 'bg-[#c9af84]' : 'bg-[#7c5d3f]';
                textColor = "text-[#513b25] text-xs";
              } else if (log.action === 'WATER_RESET') {
                markerColor = "bg-blue-400";
                textColor = "text-blue-900 font-medium bg-blue-50/70 p-1 rounded border border-blue-200 text-xs";
              } else if (log.action === 'REBIRTH') {
                markerColor = "bg-green-500";
                textColor = "text-green-900 font-medium text-xs";
              }

              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex items-start gap-2 ${textColor} py-1 px-1.5 rounded transition-colors duration-200`}
                >
                  {/* Miniature bullet dot indicator */}
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${markerColor}`} />
                  
                  {/* Message body */}
                  <div className="flex-1 min-w-0">
                    <span className="font-mono text-[9px] text-[#9c8466] mr-1">
                      {log.timestamp}
                    </span>
                    <span className="break-words inline text-xs">{log.message}</span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
