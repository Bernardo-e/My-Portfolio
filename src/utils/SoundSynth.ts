class SoundSynth {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private delayNode: DelayNode | null = null;
  private delayFeedback: GainNode | null = null;
  
  // Ambient drone nodes
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  private droneFilter: BiquadFilterNode | null = null;
  private lfo: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;

  private isInitialized = false;

  constructor() {
    // Audio Context is not started here due to browser policies
  }

  public init() {
    if (this.isInitialized) return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      this.ctx = new AudioCtx();
      this.isInitialized = true;

      // Master output volume control
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      // Smooth fade-in of master volume
      this.masterGain.gain.linearRampToValueAtTime(0.6, this.ctx.currentTime + 1.0);

      // Create a spacious delay line for premium echoing
      this.delayNode = this.ctx.createDelay(1.0);
      this.delayFeedback = this.ctx.createGain();
      
      this.delayNode.delayTime.setValueAtTime(0.35, this.ctx.currentTime); // 350ms echo
      this.delayFeedback.gain.setValueAtTime(0.4, this.ctx.currentTime); // 40% feedback

      // Connect feedback loop
      this.delayNode.connect(this.delayFeedback);
      this.delayFeedback.connect(this.delayNode);

      // Connect delay to master output (at a low mix level)
      const delayMix = this.ctx.createGain();
      delayMix.gain.setValueAtTime(0.18, this.ctx.currentTime);
      this.delayNode.connect(delayMix);
      delayMix.connect(this.masterGain);

      // Initialize the ambient background hum
      this.startAmbientHum();
    } catch (e) {
      console.warn("Web Audio API failed to initialize:", e);
    }
  }

  private startAmbientHum() {
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;

      // Low frequency drone oscillators for a beating effect
      this.osc1 = this.ctx.createOscillator();
      this.osc2 = this.ctx.createOscillator();
      
      this.osc1.type = "sawtooth";
      this.osc1.frequency.setValueAtTime(55.0, now); // A1 note
      
      this.osc2.type = "triangle";
      this.osc2.frequency.setValueAtTime(55.3, now); // Slightly detuned for beating

      // Low-pass filter to make it dark and atmospheric
      this.droneFilter = this.ctx.createBiquadFilter();
      this.droneFilter.type = "lowpass";
      this.droneFilter.frequency.setValueAtTime(110, now);
      this.droneFilter.Q.setValueAtTime(4.0, now); // Resonant bump

      // Slowly modulate filter frequency with an LFO for a breathing effect
      this.lfo = this.ctx.createOscillator();
      this.lfo.frequency.setValueAtTime(0.12, now); // Very slow LFO (8s cycle)
      this.lfoGain = this.ctx.createGain();
      this.lfoGain.gain.setValueAtTime(30, now); // Modulate by 30Hz

      this.lfo.connect(this.lfoGain);
      this.lfoGain.connect(this.droneFilter.frequency);
      
      // Drone volume control
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.0, now);
      
      // Hook up connections
      this.osc1.connect(this.droneFilter);
      this.osc2.connect(this.droneFilter);
      this.droneFilter.connect(this.droneGain);
      
      // Send some drone to the delay line for depth, and most directly to master
      const droneDelaySend = this.ctx.createGain();
      droneDelaySend.gain.setValueAtTime(0.12, now);
      this.droneFilter.connect(droneDelaySend);
      droneDelaySend.connect(this.delayNode!);

      this.droneGain.connect(this.masterGain);

      // Start the nodes
      this.osc1.start(now);
      this.osc2.start(now);
      this.lfo.start(now);

      // Smoothly fade in the drone over 3 seconds
      this.droneGain.gain.linearRampToValueAtTime(0.15, now + 3.0);
    } catch (e) {
      console.warn("Ambient hum creation failed:", e);
    }
  }

  public playPulseSound() {
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;

      // Deep sweep oscillator
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      const panner = this.ctx.createStereoPanner();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.35); // Sweeps down

      filter.type = "bandpass";
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.exponentialRampToValueAtTime(100, now + 0.35);
      filter.Q.setValueAtTime(2.0, now);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.02); // Short attack
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35); // Decay

      // Random stereo panning
      panner.pan.setValueAtTime((Math.random() - 0.5) * 1.6, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(panner);
      panner.connect(this.masterGain);

      // Send a portion to delay for wide echo
      const delaySend = this.ctx.createGain();
      delaySend.gain.setValueAtTime(0.3, now);
      gain.connect(delaySend);
      delaySend.connect(this.delayNode!);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {
      console.warn("Pulse sound play failed:", e);
    }
  }

  public playAwakenSound(pan = 0) {
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const panner = this.ctx.createStereoPanner();

      osc.type = "sine";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1600, now + 0.12);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      panner.pan.setValueAtTime(pan, now);

      osc.connect(gain);
      gain.connect(panner);
      panner.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {
      console.warn("Awaken sound play failed:", e);
    }
  }

  public playHoverSound() {
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.linearRampToValueAtTime(1000, now + 0.06);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.02, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {
      // Ignore audio glitches on mouse hover
    }
  }

  public playConnectionChord() {
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      
      // Beautiful harmonic chord (Lush Eb Major 9 / Bb add 9 voicing)
      const frequencies = [
        116.54, // Bb2
        174.61, // F3
        233.08, // Bb3
        293.66, // D4
        349.23, // F4
        440.00, // A4
        587.33  // D5
      ];

      frequencies.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const delaySend = this.ctx!.createGain();
        
        // Staggered arpeggiation for a gorgeous premium sweep
        const startOffset = idx * 0.08;
        const startTime = now + startOffset;
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.0, startTime);
        gain.gain.linearRampToValueAtTime(0.07, startTime + 0.2); // Slow attack
        gain.gain.setValueAtTime(0.07, startTime + 0.6);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 3.0); // 3s release

        delaySend.gain.setValueAtTime(0.35, startTime);

        osc.connect(gain);
        gain.connect(this.masterGain!);
        
        // Send a significant portion to the delay feedback loop for deep space chime effect
        gain.connect(delaySend);
        delaySend.connect(this.delayNode!);

        osc.start(startTime);
        osc.stop(startTime + 3.2);
      });

      // Play a deep sub-bass drop accompanying the chime
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();

      subOsc.type = "sine";
      subOsc.frequency.setValueAtTime(55, now);
      subOsc.frequency.exponentialRampToValueAtTime(30, now + 1.2);

      subGain.gain.setValueAtTime(0.0, now);
      subGain.gain.linearRampToValueAtTime(0.18, now + 0.1);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

      subOsc.connect(subGain);
      subGain.connect(this.masterGain);

      subOsc.start(now);
      subOsc.stop(now + 1.6);

    } catch (e) {
      console.warn("Connection chord play failed:", e);
    }
  }

  public fadeAndStopAmbient() {
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      // Fade out master volume in 1.2 seconds
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(0.0, now + 1.2);

      setTimeout(() => {
        if (this.ctx && this.ctx.state !== "closed") {
          try {
            // Clean up nodes
            this.osc1?.stop();
            this.osc2?.stop();
            this.lfo?.stop();
            this.ctx.close();
          } catch (e) {
            // Context already closed
          }
        }
      }, 1300);
    } catch (e) {
      console.warn("Ambient fade and stop failed:", e);
    }
  }
}

export const soundSynth = new SoundSynth();
