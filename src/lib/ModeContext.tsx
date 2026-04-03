"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ModeContextType {
  kidMode: boolean;
  toggleMode: () => void;
}

const ModeContext = createContext<ModeContextType>({
  kidMode: false,
  toggleMode: () => {},
});

export function ModeProvider({ children }: { children: ReactNode }) {
  const [kidMode, setKidMode] = useState(false);
  return (
    <ModeContext.Provider value={{ kidMode, toggleMode: () => setKidMode((p) => !p) }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  return useContext(ModeContext);
}
