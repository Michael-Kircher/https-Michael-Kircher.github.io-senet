/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameSettings, RulesVariant, AIDifficulty } from '../types';
import { ToggleLeft, ToggleRight, Volume2, VolumeX, Eye, HelpCircle, Trophy } from 'lucide-react';

interface GameSettingsProps {
  settings: GameSettings;
  onChange: (newSettings: GameSettings) => void;
  onOpenRules: () => void;
  onRestart: () => void;
}

export default function GameSettingsComponent({
  settings,
  onChange,
  onOpenRules,
  onRestart
}: GameSettingsProps) {

  const toggleVSComputer = () => {
    onChange({ ...settings, isVSComputer: !settings.isVSComputer });
  };

  const toggleSound = () => {
    onChange({ ...settings, soundEnabled: !settings.soundEnabled });
  };

  const handleRulesPresetChange = (variant: RulesVariant) => {
    if (variant === 'KENDALL') {
      onChange({
        ...settings,
        rulesVariant: 'KENDALL',
        stopAtBeauty: true,
        blockThreeInARow: true,
        backwardIfNoForward: true,
        waterResetHome: true
      });
    } else if (variant === 'BELL') {
      onChange({
        ...settings,
        rulesVariant: 'BELL',
        stopAtBeauty: false,
        blockThreeInARow: false,
        backwardIfNoForward: true,
        waterResetHome: false
      });
    } else {
      onChange({
        ...settings,
        rulesVariant: 'SENEB',
        stopAtBeauty: true,
        blockThreeInARow: true,
        backwardIfNoForward: false,
        waterResetHome: true
      });
    }
  };

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...settings, aiDifficulty: e.target.value as AIDifficulty });
  };

  const toggleRule = (key: keyof GameSettings) => {
    if (typeof settings[key] === 'boolean') {
      onChange({ ...settings, [key]: !settings[key] });
    }
  };

  const selectTheme = (theme: 'wood' | 'papyrus' | 'stone') => {
    onChange({ ...settings, theme });
  };

  return (
    <div className="bg-[#fff9eb] border-4 border-[#2d2417] p-5 shadow-[6px_6px_0px_#2d2417] rounded-none max-w-sm w-full font-serif text-[#2d2417]">
      <div className="flex justify-between items-center mb-4 border-b-2 border-[#2d2417] pb-2">
        <h3 className="font-serif font-bold text-base text-[#2d2417] flex items-center gap-1.5 uppercase tracking-wide">
          <Trophy className="w-4 h-4 text-[#2d2417]" /> Settings
        </h3>
        <button
          onClick={onOpenRules}
          className="flex items-center gap-1 text-[11px] font-serif font-bold text-[#2d2417] hover:bg-[#ebd8a7] bg-[#fff9eb] border-2 border-[#2d2417] shadow-[2px_2px_0px_#2d2417] hover:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition px-2 py-1 rounded-none cursor-pointer"
        >
          <HelpCircle className="w-3 h-3" /> Read rules
        </button>
      </div>

      {/* Opponent Selector */}
      <div className="space-y-4 text-xs font-semibold">
        <div className="flex justify-between items-center bg-[#fff9eb] p-2.5 rounded-none border-2 border-[#2d2417] shadow-[3px_3px_0px_#2d2417]">
          <div>
            <span className="block text-xs font-serif font-bold text-[#2d2417] uppercase tracking-tight">Opponent</span>
            <span className="text-[9px] text-[#2d2417]/60 block font-normal">Who are you playing against?</span>
          </div>
          <button
            onClick={toggleVSComputer}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#2d2417] hover:bg-[#4a3b26] text-[#f4e4bc] font-serif font-bold rounded-none border-2 border-[#2d2417] shadow-[2px_2px_0px_#2d2417] hover:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition cursor-pointer text-[10px]"
          >
            {settings.isVSComputer ? "AI (CPU)" : "Friend (2P)"}
          </button>
        </div>

        {/* AI Difficulty (conditioned) */}
        {settings.isVSComputer && (
          <div className="flex justify-between items-center bg-[#fff9eb] p-2.5 border-2 border-[#2d2417] shadow-[2px_2px_0px_#2d2417]">
            <span className="text-[#2d2417] font-serif font-bold">AI Level:</span>
            <select
              value={settings.aiDifficulty}
              onChange={handleDifficultyChange}
              className="bg-[#fff9eb] border-2 border-[#2d2417] px-2.5 py-1 text-xs outline-none text-[#2d2417] font-bold rounded-none"
            >
              <option value="EASY">Easy (Apprentice)</option>
              <option value="MEDIUM">Medium (Priest)</option>
              <option value="HARD">Hard (Pharaoh)</option>
            </select>
          </div>
        )}

        {/* Rules Presets */}
        <div className="space-y-1.5">
          <span className="text-[#2d2417] block font-serif font-bold uppercase text-[10px] tracking-wide">Rules Preset:</span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'KENDALL', label: 'Kendall', desc: 'Standard' },
              { id: 'BELL', label: 'Bell', desc: 'Simple' },
              { id: 'SENEB', label: 'Seneb', desc: 'Classic' }
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => handleRulesPresetChange(v.id as RulesVariant)}
                className={`py-2 px-1 text-center rounded-none border-2 transition cursor-pointer flex flex-col items-center justify-center ${
                  settings.rulesVariant === v.id
                    ? 'bg-[#ebd8a7] border-[#2d2417] text-[#2d2417] font-bold shadow-[2px_2px_0px_#2d2417]'
                    : 'bg-white/40 border-[#2d2417]/20 text-[#2d2417]/60 hover:bg-white/80 hover:border-[#2d2417]'
                }`}
              >
                <span className="text-[11px] font-serif leading-none tracking-tight">{v.label}</span>
                <span className="text-[8px] opacity-75 leading-tight">{v.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Individual rules toggle (expansion option for customization) */}
        <div className="bg-[#fff9eb] p-3 rounded-none border-2 border-[#2d2417] shadow-[3px_3px_0px_#2d2417] space-y-2">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-[#2d2417] font-serif">Force Stop at Square 26:</span>
            <button onClick={() => toggleRule('stopAtBeauty')} className="text-[#2d2417] cursor-pointer">
              {settings.stopAtBeauty ? <ToggleRight className="w-5 h-5 text-[#2d2417]" /> : <ToggleLeft className="w-5 h-5 opacity-40 text-[#2d2417]" />}
            </button>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-[#2d2417] font-serif">3-in-a-row is a blockade:</span>
            <button onClick={() => toggleRule('blockThreeInARow')} className="text-[#2d2417] cursor-pointer">
              {settings.blockThreeInARow ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5 opacity-40" />}
            </button>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-[#2d2417] font-serif">Forces reverse moves:</span>
            <button onClick={() => toggleRule('backwardIfNoForward')} className="text-[#2d2417] cursor-pointer">
              {settings.backwardIfNoForward ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5 opacity-40" />}
            </button>
          </div>
        </div>

        {/* Audio & Visual Toggles */}
        <div className="flex justify-between items-center border-t-2 border-[#2d2417] pt-3">
          <div className="flex gap-1.5">
            <button
              onClick={toggleSound}
              className={`p-2 rounded-none border-2 transition cursor-pointer ${
                settings.soundEnabled
                  ? 'bg-[#ebd8a7] border-[#2d2417] text-[#2d2417] shadow-[2px_2px_0px_#2d2417]'
                  : 'bg-[#fff9eb] border-[#2d2417]/20 text-[#2d2417]/40'
              }`}
              title="Toggle Sound"
            >
              {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center gap-1.5 font-serif">
            <span className="text-[10px] text-[#2d2417] uppercase tracking-wider font-bold">Style:</span>
            <div className="flex gap-1.5">
              {[
                { id: 'wood', bg: 'bg-[#ebdcae]', title: 'Wood' },
                { id: 'stone', bg: 'bg-[#e2e2e0]', title: 'Stone' },
                { id: 'papyrus', bg: 'bg-[#fcf8ef]', title: 'Papyrus' }
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => selectTheme(style.id as 'wood' | 'papyrus' | 'stone')}
                  className={`w-4 h-4 rounded-full ${style.bg} border-2 transition cursor-pointer ${
                    settings.theme === style.id ? 'ring-2 ring-[#2d2417] border-white' : 'border-[#2d2417]/60'
                  }`}
                  title={style.title}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Big Reset Button */}
        <button
          onClick={onRestart}
          className="w-full py-2.5 bg-[#8b3d1b] hover:bg-[#a04b24] text-[#f4e4bc] font-serif font-bold text-center rounded-none border-2 border-[#2d2417] shadow-[3px_3px_0px_#2d2417] hover:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition cursor-pointer uppercase text-[10px] tracking-widest"
        >
          Restart Game
        </button>
      </div>
    </div>
  );
}
