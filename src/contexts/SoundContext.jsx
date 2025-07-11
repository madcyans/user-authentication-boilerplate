import React, { createContext, useContext, useRef, useEffect } from "react";

const SoundContext = createContext(() => {});

export function SoundProvider({ children, volume, enabled }) {
  const clickRef = useRef();

  // update volume
  useEffect(() => {
    if (clickRef.current) clickRef.current.volume = volume;
  }, [volume]);

  const playClick = () => {
    if (!enabled || !clickRef.current) return;
    clickRef.current.currentTime = 0;
    clickRef.current.play().catch(() => {});
  };

  return (
    <SoundContext.Provider value={playClick}>
      {children}
      <audio ref={clickRef} src="/click.mp3" hidden />
    </SoundContext.Provider>
  );
}

export function useClickSound() {
  return useContext(SoundContext);
}
