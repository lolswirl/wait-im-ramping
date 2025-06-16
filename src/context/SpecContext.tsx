import React, { createContext, useContext, useState, useEffect } from "react";

interface SpecContextType {
  spec: string;
  setSpec: (spec: string) => void;
}

const SpecContext = createContext<SpecContextType | undefined>(undefined);

export const SpecProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [spec, setSpecState] = useState<string>(() => localStorage.getItem("selectedSpec") || "Mistweaver Monk");

  const setSpec = (newSpec: string) => {
    setSpecState(newSpec);
    localStorage.setItem("selectedSpec", newSpec);
  };

  useEffect(() => {
    const stored = localStorage.getItem("selectedSpec");
    if (stored && stored !== spec) setSpecState(stored);
  }, []);

  return (
    <SpecContext.Provider value={{ spec, setSpec }}>
      {children}
    </SpecContext.Provider>
  );
};

export const useSpec = () => {
  const context = useContext(SpecContext);
  if (!context) throw new Error("useSpec must be used within a SpecProvider");
  return context;
};