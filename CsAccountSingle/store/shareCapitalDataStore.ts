import { addShareCapitalData, deleteShareCapitalData, fetchShareCapitalData, updateShareCapitalData } from "@/lib/api/shareCapital";
import type { ShareCapitalProps } from "./types";
import { create } from "zustand";

export type State = {
  shareCapitalData: ShareCapitalProps[];
  isLoading: boolean; 
  error: string | null; 
};

export type Actions = {
  fetchShareCapitalData: (companyId: string) => Promise<void>;
  addShareCapitalData: (data: ShareCapitalProps, companyId: string) => Promise<void>;
  deleteShareCapitalData: (id: number, companyId: string) => Promise<void>;
  updateShareCapitalData: (shareData: ShareCapitalProps, companyId: string) => Promise<void>;
};


export const useShareCapitalStore = create<State & Actions>()((set) => ({
  shareCapitalData: [],
  isLoading: false,
  error: null,
  // Fetch data from the backend
  fetchShareCapitalData: async (companyId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetchShareCapitalData(companyId)
      const data: any = response.data
      if (response.shareTypeMap){
        data.shareTypeMap = response.shareTypeMap
      }
      set({ shareCapitalData: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Add data to the backend and update the store
  addShareCapitalData: async (data: ShareCapitalProps, companyId: string) => {
    try {
      console.log("companyId", companyId);
      const response = await addShareCapitalData(data, companyId);
      console.log(response.data, "--------------")
      if (!response.data) {
        throw new Error("Failed to add share capital data.");
      }
      console.log("response.data", response.data) 
      let newData:ShareCapitalProps = response.data

      set((state) => ({
        shareCapitalData: [...state.shareCapitalData, newData],
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  // Delete data from the backend and update the store
  deleteShareCapitalData: async (id: number, companyId: string) => {
    try {
      console.log("companyId", companyId, id);
      const response = await deleteShareCapitalData(id, companyId);

      if (!response.data) {
        throw new Error("Failed to delete share capital data.");
      }

      set((state) => ({
        shareCapitalData: state.shareCapitalData.filter((data) => data.id !== id),
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  // Update data in the backend and update the store
  updateShareCapitalData: async (shareData: ShareCapitalProps, companyId: string) => {
    try {
      const response = await updateShareCapitalData(shareData, companyId);
      console.log(response, "response")
      

      const updatedData = response.data;
      if (!updatedData) {
        throw new Error("Failed to update share capital data.");
      }

      set((state) => ({
        shareCapitalData: state.shareCapitalData.map((data) =>
          data.id === updatedData.id ? updatedData : data
        ),
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },
}));
