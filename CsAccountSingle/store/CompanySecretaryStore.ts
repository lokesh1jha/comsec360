import { 
    fetchSecretaryData, 
    addSecretaryData, 
  } from "@/lib/api/companySecretary";
  import { create } from "zustand";
  import type { CompanySecretaryProps } from "./types";
  
  export type State = {
    companySecretaryData: CompanySecretaryProps | null; // Secretary data
    isLoading: boolean; // Loading state
    error: string | null; // Error state
};

export type Actions = {
    fetchCompanySecretaryData: (companyId: string) => Promise<void>; 
    addCompanySecretaryData: (data: CompanySecretaryProps, companyId: string) => Promise<void>; 
};


  export const useCompanySecretaryStore = create<State & Actions>()((set) => ({
    companySecretaryData: null,
    isLoading: false,
    error: null,
  
    // Fetch data from the backend
    fetchCompanySecretaryData: async (companyId: string) => {
      set({ isLoading: true, error: null });
      try {
        const data = await fetchSecretaryData(companyId);
        set({ companySecretaryData: data, isLoading: false });
      } catch (error: any) {
        set({ error: error.message, isLoading: false });
      }
    },
  
    // Add data to the backend and update the store
    addCompanySecretaryData: async (data: CompanySecretaryProps, companyId: string) => {
      try {
        const response = await addSecretaryData(data, companyId);
        if (!response.success) {
          throw new Error("Failed to add company secretary data.");
        }
        const newData: CompanySecretaryProps = response.data;
        set((state) => ({
          companySecretaryData: newData,
        }));
      } catch (error: any) {
        set({ error: error.message });
      }
    },
  
    // Delete data from the backend and update the store
    // deleteCompanySecretaryData: async (id: number, companyId: string) => {
    //   try {
    //     const response = await deleteCompanySecretaryData(id, companyId);
    //     if (!response.ok) {
    //       throw new Error("Failed to delete company secretary data.");
    //     }
    //     set((state) => ({
    //       companySecretaryData: state.companySecretaryData.filter((data) => data.id !== id),
    //     }));
    //   } catch (error: any) {
    //     set({ error: error.message });
    //   }
    // },
  
    // Update data in the backend and update the store
    // updateCompanySecretaryData: async (secretaryData: CompanySecretaryProps, companyId: string) => {
    //   try {
    //     const response = await updateCompanySecretaryData(secretaryData, companyId);
    //     if (!response.ok) {
    //       throw new Error("Failed to update company secretary data.");
    //     }
    //     const updatedData = await response.json();
    //     set((state) => ({
    //       companySecretaryData: state.companySecretaryData.map((data) =>
    //         data.id === updatedData.id ? updatedData : data
    //       ),
    //     }));
    //   } catch (error: any) {
    //     set({ error: error.message });
    //   }
    // },
  }));
  