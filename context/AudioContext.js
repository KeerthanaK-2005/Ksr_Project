// context/AudioContext.js
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import Sound from 'react-native-sound';

Sound.setCategory('Playback');

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);
  const soundRef = useRef(null);

  useEffect(() => {
    const sound = new Sound(require('../assets/music.mp3'), (error) => {
      if (error) {
        console.log('Error loading sound:', error);
        return;
      }
      sound.setNumberOfLoops(-1);
      if (!isMuted) sound.play();
    });

    soundRef.current = sound;

    return () => {
      sound.release();
    };
  }, []);

  useEffect(() => {
    if (soundRef.current) {
      if (isMuted) {
        soundRef.current.pause();
      } else {
        soundRef.current.play();
      }
    }
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <AudioContext.Provider value={{ isMuted, toggleMute }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
