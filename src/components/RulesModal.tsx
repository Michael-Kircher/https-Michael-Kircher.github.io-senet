/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X, HelpCircle, FileText, Compass, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RulesModal({ isOpen, onClose }: RulesModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-none bg-[#fff9eb] border-4 border-[#2d2417] p-6 text-[#2d2417] shadow-[12px_12px_0px_#2d2417] font-serif"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-none bg-[#ebd8a7] hover:bg-[#ebdcae] border-2 border-[#2d2417] shadow-[2px_2px_0px_#2d2417] hover:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition duration-150 text-[#2d2417] cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex flex-col items-center mb-6 text-center">
            <span className="text-xs font-mono tracking-widest uppercase text-[#2d2417]/80 font-bold">Ancient Egyptian Cultural Heritage</span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#2d2417] tracking-tight mt-1">
              The Game of Senet (𓊠𓈓)
            </h2>
            <div className="w-32 h-1 bg-[#2d2417] mt-2" />
          </div>

          <div className="space-y-6 text-xs leading-relaxed text-[#2d2417]">
            {/* History Section */}
            <section className="bg-[#fff9eb] p-4 rounded-none border-2 border-[#2d2417] shadow-[3px_3px_0px_#2d2417]">
              <h3 className="flex items-center gap-2 text-base font-serif font-bold text-[#2d2417] mb-2 uppercase tracking-wide">
                <Compass className="w-4 h-4 text-[#2d2417]" />
                History and Mythology
              </h3>
              <p>
                Senet is one of the oldest known board games in the world, with historical evidence dating back to at least <strong>3000 BC</strong>. During the New Kingdom, it evolved into a symbolic representation of the <strong>soul’s journey into the afterlife</strong> (the underworld known as Duat). Players who successfully guided their pieces off the board achieved union with the sun god Re-Atum and secured eternity. Legendary pharaohs like Tutankhamun and Queen Nefertari were depicted in their tomb art playing exquisite sets of Senet.
              </p>
            </section>

            {/* Core Mechanics */}
            <section className="bg-[#fff9eb]/50 p-4 rounded-none border-2 border-[#2d2417] shadow-[3px_3px_0px_#2d2417]">
              <h3 className="flex items-center gap-2 text-base font-serif font-bold text-[#2d2417] mb-3 uppercase tracking-wide">
                <FileText className="w-4 h-4 text-[#2d2417]" />
                The Rules of the Game
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-bold text-[#2d2417] text-xs uppercase tracking-wider border-b border-[#2d2417] pb-1">Flow & Movement</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>The board consists of <strong>30 squares</strong> arranged in three rows of 10.</li>
                    <li>Pieces move along an <strong>S-curve (boustrophedon)</strong> pattern from square 1 to 30.</li>
                    <li><strong>Start:</strong> 5 Cones (You) and 5 Spools (CPU) are placed alternately on squares 1 to 10.</li>
                    <li>The goal is to be the first player to guide all 5 of your pieces off square 30 into the afterlife.</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-[#2d2417] text-xs uppercase tracking-wider border-b border-[#2d2417] pb-1">Capturing & Protection</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Two of your friendly pieces occupying adjacent squares <strong>protect each other</strong>. They cannot be captured or swapped.</li>
                    <li><strong>Blockade (3-in-a-row):</strong> Three consecutive pieces of the same color create an impassable barrier. No opponent piece can jump over this blockade.</li>
                    <li>Landing on an unprotected opponent's piece captures it, swapping its position back to where your moving piece began its journey.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Throwing sticks */}
            <section className="bg-[#fff9eb]/50 p-4 rounded-none border-2 border-[#2d2417] shadow-[3px_3px_0px_#2d2417]">
              <h3 className="text-base font-serif font-bold text-[#2d2417] mb-2 uppercase tracking-wide">The Casting Sticks</h3>
              <p className="mb-3">Double-sided casting sticks determine the throw value (flat/light side up vs. round/dark side up):</p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
                <div className="p-2 bg-[#fff9eb] rounded-none border-2 border-[#2d2417] shadow-[2px_2px_0px_#2d2417] flex flex-col items-center justify-between">
                  <span className="font-bold text-[#2d2417] text-[11px] block">1 Flat Up</span>
                  <span className="text-[#104a08] font-bold mt-1 text-[10px]">+1 Space & Cast Again</span>
                </div>
                <div className="p-2 bg-[#fff9eb] rounded-none border-2 border-[#2d2417] shadow-[2px_2px_0px_#2d2417] flex flex-col items-center justify-between">
                  <span className="font-bold text-[#2d2417] text-[11px] block">2 Flat Up</span>
                  <span className="text-[#8b3d1b] font-bold mt-1 text-[10px]">+2 & Switch Turn</span>
                </div>
                <div className="p-2 bg-[#fff9eb] rounded-none border-2 border-[#2d2417] shadow-[2px_2px_0px_#2d2417] flex flex-col items-center justify-between">
                  <span className="font-bold text-[#2d2417] text-[11px] block">3 Flat Up</span>
                  <span className="text-[#8b3d1b] font-bold mt-1 text-[10px]">+3 & Switch Turn</span>
                </div>
                <div className="p-2 bg-[#fff9eb] rounded-none border-2 border-[#2d2417] shadow-[2px_2px_0px_#2d2417] flex flex-col items-center justify-between">
                  <span className="font-bold text-[#2d2417] text-[11px] block">4 Flat Up</span>
                  <span className="text-[#104a08] font-bold mt-1 text-[10px]">+4 Spaces & Cast Again</span>
                </div>
                <div className="p-2 bg-[#fff9eb] rounded-none border-2 border-[#2d2417] shadow-[2px_2px_0px_#2d2417] flex flex-col items-center justify-between col-span-2 sm:col-span-1">
                  <span className="font-bold text-[#2d2417] text-[11px] block">0 Flat Up</span>
                  <span className="text-[#104a08] font-bold mt-1 text-[10px]">+5 Spaces & Cast Again</span>
                </div>
              </div>
            </section>

            {/* Special Squares (Houses) */}
            <section>
              <h3 className="flex items-center gap-2 text-base font-serif font-bold text-[#2d2417] mb-3 uppercase tracking-wide">
                <Award className="w-4 h-4 text-[#2d2417]" />
                The Five Houses (Special Squares)
              </h3>
              <div className="space-y-3">
                {/* 15 */}
                <div className="flex gap-4 p-3 bg-white/50 rounded-none border-2 border-[#2d2417] shadow-[2px_2px_0px_#2d2417]">
                  <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-[#ebd8a7] border-2 border-[#2d2417] rounded-none">
                    <span className="font-serif font-bold text-lg text-[#2d2417]">15</span>
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-[#2d2417] text-xs">House of Rebirth (𓉐𓏏𓆄𓆇)</h4>
                    <p className="text-[10px] mt-1">resurrection point for pieces that fall into the House of Water (Square 27). It serves as a sacred, safe sanctuary.</p>
                  </div>
                </div>

                {/* 26 */}
                <div className="flex gap-4 p-3 bg-white/50 rounded-none border-2 border-[#2d2417] shadow-[2px_2px_0px_#2d2417]">
                  <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-[#ebd8a7] border-2 border-[#2d2417] rounded-none">
                    <span className="font-serif font-bold text-lg text-[#2d2417]">26</span>
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-[#2d2417] text-xs">House of Beauty (𓉐𓄤)</h4>
                    <p className="text-[10px] mt-1"><strong>Mandatory Stop!</strong> All pieces must pause here to receive blessings before traveling towards the afterlife.</p>
                  </div>
                </div>

                {/* 27 */}
                <div className="flex gap-4 p-3 bg-red-50 rounded-none border-2 border-red-900 shadow-[2px_2px_0px_rgba(239,68,68,0.3)]">
                  <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-red-200 border-2 border-red-900 rounded-none">
                    <span className="font-serif font-bold text-lg text-red-900">27</span>
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-red-900 text-xs">House of Water (𓉐𓈗)</h4>
                    <p className="text-[10px] mt-1 text-red-955 font-semibold">Treachorous Trap! Landing here drowns the piece in the Nile, resetting its position back to the House of Rebirth (Square 15).</p>
                  </div>
                </div>

                {/* 28, 29, 30 */}
                <div className="flex gap-4 p-3 bg-white/50 rounded-none border-2 border-[#2d2417] shadow-[2px_2px_0px_#2d2417]">
                  <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-[#ebd8a7] border-2 border-[#2d2417] rounded-none">
                    <span className="font-serif font-bold text-lg text-[#2d2417]">28-30</span>
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-[#2d2417] text-xs">Houses of the Three Truths (28), Two Re-Atoum (29) & Horus (30)</h4>
                    <p className="text-[10px] mt-1">
                      Safe squares. Bearing off from the board requires an <strong>exact throw</strong> (Square 28 requires a 3, Square 29 requires a 2, Square 30 requires a 1).
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#8b3d1b] hover:bg-[#a04b24] text-[#f4e4bc] font-serif font-bold rounded-none border-2 border-[#2d2417] shadow-[4px_4px_0px_#2d2417] hover:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition pointer-events-auto cursor-pointer uppercase text-xs tracking-widest"
            >
              May Re guide my hand!
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
