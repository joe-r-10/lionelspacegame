/**
 * Audio Generator - Creates game audio using Web Audio API
 */

// Function to generate and download audio
function generateAudio() {
    // Create audio context
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Generate laser sound
    generateLaserSound(audioContext);
    
    // Generate explosion sound
    generateExplosionSound(audioContext);
    
    // Generate powerup sound
    generatePowerupSound(audioContext);
    
    // Generate game over sound
    generateGameOverSound(audioContext);
    
    // Generate background music
    generateBackgroundMusic(audioContext);
}

// Function to download audio data
function downloadAudio(audioBuffer, filename) {
    // Convert audio buffer to wave file
    const wavData = audioBufferToWav(audioBuffer);
    
    // Create blob
    const blob = new Blob([wavData], { type: 'audio/wav' });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    
    // Clean up
    URL.revokeObjectURL(url);
}

// Function to generate laser sound
function generateLaserSound(audioContext) {
    // Create buffer
    const sampleRate = audioContext.sampleRate;
    const duration = 0.3;
    const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    
    // Fill buffer with sine wave
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < buffer.length; i++) {
        const t = i / sampleRate;
        // Frequency sweeping from high to low
        const frequency = 1000 - 500 * t;
        channelData[i] = Math.sin(2 * Math.PI * frequency * t) * (1 - t / duration);
    }
    
    // Download audio
    downloadAudio(buffer, 'laser.mp3');
}

// Function to generate explosion sound
function generateExplosionSound(audioContext) {
    // Create buffer
    const sampleRate = audioContext.sampleRate;
    const duration = 1.0;
    const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    
    // Fill buffer with noise
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < buffer.length; i++) {
        const t = i / sampleRate;
        // Random noise with decay
        channelData[i] = (Math.random() * 2 - 1) * (1 - t / duration);
    }
    
    // Download audio
    downloadAudio(buffer, 'explosion.mp3');
}

// Function to generate powerup sound
function generatePowerupSound(audioContext) {
    // Create buffer
    const sampleRate = audioContext.sampleRate;
    const duration = 0.5;
    const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    
    // Fill buffer with ascending tones
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < buffer.length; i++) {
        const t = i / sampleRate;
        // Ascending frequency
        const frequency = 300 + 700 * t;
        channelData[i] = Math.sin(2 * Math.PI * frequency * t) * (1 - t / duration);
    }
    
    // Download audio
    downloadAudio(buffer, 'powerup.mp3');
}

// Function to generate game over sound
function generateGameOverSound(audioContext) {
    // Create buffer
    const sampleRate = audioContext.sampleRate;
    const duration = 2.0;
    const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    
    // Fill buffer with descending tones
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < buffer.length; i++) {
        const t = i / sampleRate;
        // Descending frequency
        const frequency = 400 - 200 * t;
        channelData[i] = Math.sin(2 * Math.PI * frequency * t) * (1 - t / duration);
    }
    
    // Download audio
    downloadAudio(buffer, 'game-over.mp3');
}

// Function to generate background music
function generateBackgroundMusic(audioContext) {
    // Create buffer
    const sampleRate = audioContext.sampleRate;
    const duration = 20.0;
    const buffer = audioContext.createBuffer(2, sampleRate * duration, sampleRate);
    
    // Define chord progression
    const chords = [
        [261.63, 329.63, 392.00], // C major
        [293.66, 349.23, 440.00], // D major
        [329.63, 415.30, 493.88], // E major
        [349.23, 440.00, 523.25]  // F major
    ];
    
    // Fill buffer with arpeggiated chords
    const leftChannelData = buffer.getChannelData(0);
    const rightChannelData = buffer.getChannelData(1);
    
    for (let i = 0; i < buffer.length; i++) {
        const t = i / sampleRate;
        const chordIndex = Math.floor(t * 0.5) % chords.length;
        const chord = chords[chordIndex];
        
        // Arpeggio pattern
        const noteIndex = Math.floor(t * 8) % 3;
        const frequency = chord[noteIndex];
        
        // Add some variety with a tremolo effect
        const tremolo = 0.7 + 0.3 * Math.sin(2 * Math.PI * 4 * t);
        
        // Create sound
        const value = 0.2 * Math.sin(2 * Math.PI * frequency * t) * tremolo;
        
        // Pan between left and right channels
        const pan = 0.5 + 0.5 * Math.sin(2 * Math.PI * 0.1 * t);
        leftChannelData[i] = value * (1 - pan);
        rightChannelData[i] = value * pan;
    }
    
    // Download audio
    downloadAudio(buffer, 'background-music.mp3');
}

// Function to convert audio buffer to WAV format
// Based on https://github.com/mohayonao/audio-buffer-to-wav
function audioBufferToWav(buffer) {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;
    
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;
    
    const dataSize = buffer.length * blockAlign;
    const fileSize = 44 + dataSize;
    
    const arrayBuffer = new ArrayBuffer(fileSize);
    const view = new DataView(arrayBuffer);
    
    // RIFF identifier
    writeString(view, 0, 'RIFF');
    // file length minus RIFF identifier length and file description length
    view.setUint32(4, fileSize - 8, true);
    // RIFF type
    writeString(view, 8, 'WAVE');
    // format chunk identifier
    writeString(view, 12, 'fmt ');
    // format chunk length
    view.setUint32(16, 16, true);
    // sample format (raw)
    view.setUint16(20, format, true);
    // channel count
    view.setUint16(22, numChannels, true);
    // sample rate
    view.setUint32(24, sampleRate, true);
    // byte rate (sample rate * block align)
    view.setUint32(28, sampleRate * blockAlign, true);
    // block align (channel count * bytes per sample)
    view.setUint16(32, blockAlign, true);
    // bits per sample
    view.setUint16(34, bitDepth, true);
    // data chunk identifier
    writeString(view, 36, 'data');
    // data chunk length
    view.setUint32(40, dataSize, true);
    
    // Write the PCM samples
    const offset = 44;
    for (let i = 0; i < buffer.length; i++) {
        for (let channel = 0; channel < numChannels; channel++) {
            const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
            const value = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
            view.setInt16(offset + (i * blockAlign) + (channel * bytesPerSample), value, true);
        }
    }
    
    return new Uint8Array(arrayBuffer);
}

// Helper function to write a string to the data view
function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

// Export audio generator
window.audioGenerator = {
    generateAudio
}; 