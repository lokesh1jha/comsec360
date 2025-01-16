import { create } from "zustand";
import {
    addSharedHolderData as addData,
    deleteShareHolderData as deleteData,
    fetchShareHolderData as fetchData,
    updateShareHolderData as updateData,
} from "@/lib/api/shareHolder";
import type { ShareHolderProps, ShareholdersUpdateProps, ShareHolderUpdateProps } from "./types";

// Define the state type
export type State = {
    shareHolderData: ShareHolderProps[]; 
    isLoading: boolean; 
    error: string | null;
};

// Define the actions type
export type Actions = {
    fetchShareHolderData: (companyId: string) => Promise<void>; // Fetch data action
    addShareHolderData: (data: ShareHolderProps, companyId: string) => Promise<void>; // Add data action
    deleteShareHolderData: (id: number, companyId: string) => Promise<void>; // Delete data action
    updateShareHolderData: (shareData: ShareholdersUpdateProps, companyId: string) => Promise<void>; // Update data action
};

// Combine state and actions into the store
export const useShareHolderStore = create<State & Actions>((set) => ({
    shareHolderData: [],
    isLoading: false,
    error: null,

    // Fetch data from the backend
    fetchShareHolderData: async (companyId: string) => {
        set({ isLoading: true, error: null });
        try {
            const data = await fetchData(companyId);
            console.log("shareHolder data", data);
            set({ shareHolderData: data, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    // Add data to the backend and update the store
    addShareHolderData: async (data: ShareHolderProps, companyId: string) => {
        try {
            const response = await addData(data, companyId);
            if (!response.data) {
                throw new Error("Failed to add shareholder data.");
            }
            const newData = response.data;
            set((state) => ({
                shareHolderData: [...state.shareHolderData, newData],
            }));
        } catch (error: any) {
            set({ error: error.message });
        }
    },

    // Delete data from the backend and update the store
    deleteShareHolderData: async (id: number, companyId: string) => {
        try {
            const response = await deleteData(id, companyId);
            if (!response.data) {
                throw new Error("Failed to delete shareholder data.");
            }
            set((state) => ({
                shareHolderData: state.shareHolderData.filter((data) => data.id !== id),
            }));
        } catch (error: any) {
            set({ error: error.message });
        }
    },

    // Update data in the backend and update the store
    updateShareHolderData: async (shareData: any, companyId: string) => {
        try {
            console.log("updateShareHolderData shareData", shareData);
            const response = await updateData(shareData, companyId);
            if (!response.data) {
                throw new Error("Failed to update shareholder data.");
            }
            const updatedData = response.data;
            set((state) => ({
                shareHolderData: state.shareHolderData.map((data) =>
                    data.id === updatedData.id ? updatedData : data
                ),
            }));
        } catch (error: any) {
            set({ error: error.message });
        }
    },
}));
