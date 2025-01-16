import type { Dispatch, SetStateAction } from "react";


export type ContextProps = {
    tabValue: "CI" | "SI" | "D" | "CS";
    setTabValue: Dispatch<SetStateAction<"CI" | "SI" | "D" | "CS">>;
    disableSI: boolean;
    setDisableSI: Dispatch<SetStateAction<boolean>>;
    disableDirectors: boolean;
    setDisableDirectors: Dispatch<SetStateAction<boolean>>;
    disableCS: boolean;
    setDisableCS: Dispatch<SetStateAction<boolean>>;
    companyId: string;
    setCompanyId: Dispatch<SetStateAction<string>>
  };