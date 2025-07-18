import { useEffect, useState } from 'react';
import Sound from 'react-native-sound';

Sound.setCategory('Playback');

export default function useBackgroundMusic() {
  const [isMuted, setIsMuted] = useState(false);
  const [music, setMusic] = useState(null);

  useEffect(() => {
    const sound = new Sound(require('../assets/music.mp3'), (error) => {
      if (!error) {
        sound.setNumberOfLoops(-1);
        sound.setVolume(isMuted ? 0 : 1); // Set volume based on muted state
        if (!isMuted) {
          sound.play(); // Only play if not muted
        }
        setMusic(sound); // Save reference
      }
    });

    return () => {
      if (sound) {
        sound.release();
      }
    };
  }, [isMuted]); // depend on isMuted

  const toggleMute = () => {
    if (music) {
      const nextMute = !isMuted;
      if (nextMute) {
        music.pause();
      } else {
        music.setVolume(1);
        music.play();
      }
      setIsMuted(nextMute);
    }
  };

  return { isMuted, toggleMute };
}
