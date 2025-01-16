import { create } from "zustand";

type State = {
  TabValue: "CompanyInfo" | "SharesInfo" | "Directors" | "CompanySecretary";
  TabState: {
    disableSharesInfo: boolean;
    disableDirectors: boolean;
    disableCompanySecretary: boolean;
  };
};

// type Actions = {
    
// }

export const FormStateStore = {};
