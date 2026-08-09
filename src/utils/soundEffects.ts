/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

let audioCtx: AudioContext | null = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playMoveSound(enabled: boolean) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Soothing, high-fidelity double ancient harp pluck
    const playPluck = (freq: number, delay: number, vol: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);
      // Gentle frequency bend downwards to make it feel natural and soft
      osc.frequency.exponentialRampToValueAtTime(freq * 0.98, now + delay + 0.35);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now + delay);

      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(vol, now + delay + 0.015); // soft warm attack, no pop
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.4);

      osc.start(now + delay);
      osc.stop(now + delay + 0.45);
    };

    // A beautiful major third dyad (G4 and B4)
    playPluck(392.00, 0, 0.07);      // G4
    playPluck(493.88, 0.04, 0.05);   // B4 (slightly staggered for a luxurious strum feel)
  } catch (e) {
    console.warn("Audio error:", e);
  }
}

export function playCaptureSound(enabled: boolean) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const noise = ctx.createOscillator(); // Or a custom low pitch
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Dynamic metallic clack
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.setValueAtTime(200, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {
    console.warn("Audio error:", e);
  }
}

export function playWaterSound(enabled: boolean) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Bubbling downward slide
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.45);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {
    console.warn("Audio error:", e);
  }
}

export function playRebirthSound(enabled: boolean) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    
    // Ankh/Lotus resurrection chime - rising arpeggio
    const playTone = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
      gain.gain.setValueAtTime(0.1, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration);
    };

    playTone(261.63, 0.0, 0.2); // C4
    playTone(329.63, 0.07, 0.2); // E4
    playTone(392.00, 0.14, 0.2); // G4
    playTone(523.25, 0.21, 0.3); // C5
  } catch (e) {
    console.warn("Audio error:", e);
  }
}

export function playCastSound(enabled: boolean) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Realistic dry, hollow wooden stick impact simulator
    const playWoodTap = (time: number, volume: number) => {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      // Randomize frequencies to match slightly different stick resonance sizes
      const baseFreq = 850 + Math.random() * 550; // 850Hz to 1400Hz (perfect woody clack range)
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(baseFreq, time);
      
      osc2.type = 'sawtooth'; // adds micro-texture for dry wood friction
      osc2.frequency.setValueAtTime(baseFreq * 1.4, time);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(baseFreq, time);
      filter.Q.setValueAtTime(3.8, time); // resonant dry wood envelope

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(volume, time + 0.003); // rapid soft-start
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.02 + Math.random() * 0.035); // wood damping decay

      osc1.start(time);
      osc2.start(time);
      osc1.stop(time + 0.08);
      osc2.stop(time + 0.08);
    };

    // Stagger a sequence of 12 premium wooden clatters to simulate shaking and then dropping.
    const tapCount = 12;
    for (let i = 0; i < tapCount; i++) {
      // Create a nice acceleration/deceleration hand-rattle flow
      const delay = (i * 0.052) + (Math.sin(i * 0.5) * 0.015) + (Math.random() * 0.015);
      const isLastTaps = i >= tapCount - 4;
      // Last taps are slightly more impactful as they hit each other or the board
      const vol = isLastTaps
        ? 0.12 + Math.random() * 0.08
        : 0.05 + Math.random() * 0.05;

      playWoodTap(now + delay, vol);
    }
  } catch (e) {
    console.warn("Audio error:", e);
  }
}

export function playWinSound(enabled: boolean) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Glorious Phrygian-dominant chord progression
    const playSustainedTone = (freq: number, start: number, duration: number, vol: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sawtooth';
      
      // Filter for warm sound
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, now + start);
      filter.Q.setValueAtTime(1, now + start);
      
      osc.disconnect(gain);
      osc.connect(filter);
      filter.connect(gain);
      
      osc.frequency.setValueAtTime(freq, now + start);
      
      gain.gain.setValueAtTime(0.001, now + start);
      gain.gain.linearRampToValueAtTime(vol, now + start + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + start + duration);
      
      osc.start(now + start);
      osc.stop(now + start + duration);
    };

    // Beautiful Egyptian style motif (Phrygian Dominant in G/D)
    // D4: 293.66, F#4: 369.99, A4: 440.00, Bb4: 466.16
    playSustainedTone(293.66, 0.0, 1.5, 0.1); // D4
    playSustainedTone(369.99, 0.2, 1.3, 0.08); // F#4
    playSustainedTone(440.00, 0.4, 1.1, 0.08); // A4
    playSustainedTone(466.16, 0.6, 1.5, 0.1); // Bb4 (dramatic fourth)
    
    // Higher octave resolution
    playSustainedTone(587.33, 1.4, 2.0, 0.12); // D5
  } catch (e) {
    console.warn("Audio error:", e);
  }
}

export function playClickSound(enabled: boolean) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  } catch (e) {
    console.warn("Audio error:", e);
  }
}
