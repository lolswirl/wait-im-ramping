"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { CLASSES, specialization, getSpecializationByKey } from "../data/class/class.ts";

interface SpecContextType {
  spec: specialization;
  setSpec: (spec: specialization) => void;
}

const SpecContext = createContext<SpecContextType | undefined>(undefined);

export const SpecProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always use a default value on the server
  const [specKey, setSpecKey] = useState<string>("MONK:MISTWEAVER");

  // On mount (client), update from localStorage if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("selectedSpec");
      if (stored && stored !== specKey) setSpecKey(stored);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const spec = getSpecializationByKey(specKey)!;

  const setSpec = (newSpec: specialization) => {
    const classKey = Object.entries(CLASSES).find(([, c]) =>
      Object.values(c.SPECS).includes(newSpec)
    )?.[0];

    if (!classKey) {
      console.warn("Invalid spec passed to setSpec");
      return;
    }

    const newKey = `${classKey}:${newSpec.name.toUpperCase()}`;
    setSpecKey(newKey);
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedSpec", newKey);
    }
  };

  return (
    <SpecContext.Provider value={{ spec, setSpec }}>
      {children}
    </SpecContext.Provider>
  );
};

export const useSpec = (): SpecContextType => {
  const context = useContext(SpecContext);
  if (!context) throw new Error("useSpec must be used within a SpecProvider");
  return context;
};
