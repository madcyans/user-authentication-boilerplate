import { useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';

/**
 * A custom hook to manage background music playback.
 * It handles play/pause, volume, browser autoplay policies, and robust cleanup.
 * @param {React.RefObject<HTMLAudioElement>} audioRef - A ref to the <audio> element.
 */
export function useMusicPlayer(audioRef) {
  const { settings } = useSettings();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return; // Exit if the audio element isn't ready
    }

    // This function will handle playing audio after the first user click/keypress
    const playOnFirstInteraction = () => {
      if (settings.music && audio.paused) {
        audio.play().catch(e => console.error("Audio failed to play after interaction:", e));
      }
      // Clean up the listeners themselves after they have run
      document.removeEventListener('click', playOnFirstInteraction);
      document.removeEventListener('keydown', playOnFirstInteraction);
    };

    // Set volume based on settings
    audio.volume = settings.musicVolume / 100;

    if (settings.music) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // Autoplay was prevented by the browser.
          // We'll add listeners to play on the first interaction.
          document.addEventListener('click', playOnFirstInteraction);
          document.addEventListener('keydown', playOnFirstInteraction);
        });
      }
    } else {
      // If music is disabled in settings, ensure it's paused.
      audio.pause();
      audio.currentTime = 0;
    }

    // --- The All-Important Cleanup Function ---
    // This function is returned by useEffect and runs whenever the component
    // unmounts or before the effect runs again. This is key to preventing leaks.
    return () => {
      // Always remove any interaction listeners that might be active
      document.removeEventListener('click', playOnFirstInteraction);
      document.removeEventListener('keydown', playOnFirstInteraction);

      // And always pause the audio and reset its position
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [settings.music, settings.musicVolume, audioRef]); // Effect dependencies
}
