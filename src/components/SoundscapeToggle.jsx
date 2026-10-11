import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export function SoundscapeToggle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const initAudio = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;

      const ctx = new AudioCtx();

      // Master gain for smooth volume ramp
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      masterGain.connect(ctx.destination);

      // Create pink noise buffer for realistic wave body
      const bufferSize = ctx.sampleRate * 4;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter to shape into lake waves
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, ctx.currentTime);
      filter.Q.setValueAtTime(3.5, ctx.currentTime);

      // LFO for wave rhythmic surge (simulating Mazury lake swell: 0.16 Hz ~ 6.2s cycle)
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.16, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(240, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      // Connect wave chain
      whiteNoise.connect(filter);
      filter.connect(masterGain);

      // Start nodes
      whiteNoise.start(0);
      lfo.start(0);

      audioCtxRef.current = ctx;
      gainNodeRef.current = masterGain;
      return { ctx, masterGain };
    } catch (e) {
      console.warn('Web Audio Soundscape initialization unavailable:', e);
      return null;
    }
  };

  const toggleSoundscape = async () => {
    if (!isPlaying) {
      if (!audioCtxRef.current) {
        initAudio();
      }

      const ctx = audioCtxRef.current;
      const gainNode = gainNodeRef.current;

      if (ctx && gainNode) {
        if (ctx.state === 'suspended') {
          await ctx.resume();
        }
        // Smooth ramp-in (1.2s fade)
        const now = ctx.currentTime;
        gainNode.gain.cancelScheduledValues(now);
        gainNode.gain.setValueAtTime(gainNode.gain.value, now);
        gainNode.gain.linearRampToValueAtTime(0.15, now + 1.2);
        setIsPlaying(true);
      }
    } else {
      const ctx = audioCtxRef.current;
      const gainNode = gainNodeRef.current;

      if (ctx && gainNode) {
        // Smooth ramp-out (0.9s fade)
        const now = ctx.currentTime;
        gainNode.gain.cancelScheduledValues(now);
        gainNode.gain.setValueAtTime(gainNode.gain.value, now);
        gainNode.gain.linearRampToValueAtTime(0.0001, now + 0.9);
        setTimeout(() => {
          if (!isPlayingRef.current && ctx.state === 'running') {
            ctx.suspend();
          }
        }, 950);
        setIsPlaying(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <button
      type="button"
      className={`soundscape-toggle ${isPlaying ? 'active' : ''}`}
      onClick={toggleSoundscape}
      aria-label={isPlaying ? 'Wycisz dźwięki natury Jeziora Czos' : 'Włącz relaksujący szum fal Jeziora Czos'}
      title={isPlaying ? 'Dźwięk fal aktywny (kliknij, aby wyciszyć)' : 'Włącz relaksujący pejzaż dźwiękowy fal Jeziora Czos'}
    >
      <span className="soundscape-icon-wrap">
        {isPlaying ? <Volume2 size={16} className="text-lake animate-gentle-pulse" /> : <VolumeX size={16} className="text-muted" />}
      </span>
      <span className="soundscape-text">
        <span className="soundscape-label">Szum Fal Jeziora</span>
        <span className="soundscape-state">{isPlaying ? 'Włączony' : 'Wyciszony'}</span>
      </span>
      {isPlaying && (
        <span className="soundscape-bars" aria-hidden="true">
          <span className="bar bar-1"></span>
          <span className="bar bar-2"></span>
          <span className="bar bar-3"></span>
        </span>
      )}
    </button>
  );
}
