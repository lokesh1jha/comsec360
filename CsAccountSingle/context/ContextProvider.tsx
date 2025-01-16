"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ContextProps } from "./Declarations";


const defaultValues = {
  
  tabValue: "CI" as "CI" | "SI" | "D" | "CS",
  setTabValue: () => {},
  disableSI: true,
  setDisableSI: () => {},
  disableDirectors: true,
  setDisableDirectors: () => {},
  disableCS: true,
  setDisableCS: () => {},
  companyId: "",
  setCompanyId: () => {},
};

const DataContext = createContext<ContextProps>(defaultValues);

export const DataContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [tabValue, setTabValue] = useState<"CI" | "SI" | "D" | "CS">("CI");
  const [disableSI, setDisableSI] = useState(true);
  const [disableDirectors, setDisableDirectors] = useState(true);
  const [disableCS, setDisableCS] = useState(true);

  const [companyId, setCompanyId] = useState(() => {
    // Initialize from localStorage if it exists and is valid
    if (typeof window === "undefined") return "";
    const storedCompanyId = localStorage.getItem("companyId");
    return storedCompanyId && !isNaN(Number(storedCompanyId))
      ? storedCompanyId
      : "";
  });

  useEffect(() => {
    // Only update `localStorage` when the state changes after initialization
    if (companyId) {
      localStorage.setItem("companyId", companyId);
    }
  }, [companyId]);

  return (
    <DataContext.Provider
      value={{
        tabValue: tabValue,
        setTabValue: setTabValue,
        disableSI: disableSI,
        setDisableSI: setDisableSI,
        disableDirectors: disableDirectors,
        setDisableDirectors: setDisableDirectors,
        disableCS: disableCS,
        setDisableCS: setDisableCS,
        companyId: companyId,
        setCompanyId: setCompanyId
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const  useDataContext = () => useContext(DataContext);
