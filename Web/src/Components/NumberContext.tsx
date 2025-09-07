"use client";
import React, { createContext, useState, ReactNode, FC } from "react";

interface NumberContextType {
  number: number;
  setNumber: React.Dispatch<React.SetStateAction<number>>;
}

export const NumberContext = createContext<NumberContextType | undefined>(
  undefined
);

interface NumberProviderProps {
  children: ReactNode;
}

export const NumberProvider: FC<NumberProviderProps> = ({ children }) => {
  const [number, setNumber] = useState(0);

  return (
    <NumberContext.Provider value={{ number, setNumber }}>
      {children}
    </NumberContext.Provider>
  );
};
