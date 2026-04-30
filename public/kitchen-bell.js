// Generate a kitchen bell ringing sound using Web Audio API
export const playKitchenBellSound = () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  // Create oscillators for a pleasant ringing sound
  const now = audioContext.currentTime;
  
  // First bell tone (higher pitch)
  const osc1 = audioContext.createOscillator();
  const gain1 = audioContext.createGain();
  osc1.connect(gain1);
  gain1.connect(audioContext.destination);
  
  osc1.frequency.setValueAtTime(800, now);
  osc1.frequency.exponentialRampToValueAtTime(600, now + 0.5);
  gain1.gain.setValueAtTime(0.3, now);
  gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
  
  osc1.start(now);
  osc1.stop(now + 0.8);
  
  // Second bell tone (lower pitch) - delayed
  const osc2 = audioContext.createOscillator();
  const gain2 = audioContext.createGain();
  osc2.connect(gain2);
  gain2.connect(audioContext.destination);
  
  osc2.frequency.setValueAtTime(600, now + 0.1);
  osc2.frequency.exponentialRampToValueAtTime(400, now + 0.6);
  gain2.gain.setValueAtTime(0.2, now + 0.1);
  gain2.gain.exponentialRampToValueAtTime(0.01, now + 1);
  
  osc2.start(now + 0.1);
  osc2.stop(now + 1);
  
  // Add reverb effect with delay
  const delay = audioContext.createDelay();
  const delayGain = audioContext.createGain();
  delay.delayTime.value = 0.1;
  delayGain.gain.value = 0.3;
  
  gain1.connect(delay);
  gain2.connect(delay);
  delay.connect(delayGain);
  delayGain.connect(audioContext.destination);
};
