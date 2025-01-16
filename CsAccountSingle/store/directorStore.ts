import { create } from "zustand";
import {
    addDirectorsData as addData,
    deleteDirectorsData as deleteData,
    fetchDirectorsData as fetchData,
    updateDirectorsData as updateData,
} from "@/lib/api/director";
import type { DirectorProps, DirectorUpdateProps } from "./types";

export type State = {
    directorData: DirectorProps[]; // List of director data
    isLoading: boolean; // Loading state
    error: string | null; // Error state
};

export type Actions = {
    fetchDirectorData: (companyId: string) => Promise<void>; 
    addDirectorData: (data: DirectorProps, companyId: string) => Promise<void>; 
    deleteDirectorData: (id: number, companyId: string) => Promise<void>;
    updateDirectorData: (directorData: DirectorUpdateProps, companyId: string) => Promise<void>; 
};

export const useDirectorStore = create<State & Actions>((set) => ({
    directorData: [],
    isLoading: false,
    error: null,

    fetchDirectorData: async (companyId: string) => {
        set({ isLoading: true, error: null });
        try {
            const data = await fetchData(companyId);
            console.log("director data", data);
            set({ directorData: data, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    addDirectorData: async (data: DirectorProps, companyId: string) => {
        try {
            const response = await addData(data, companyId);
            if (!response.data) {
                throw new Error("Failed to add director data.");
            }
            const newData = response.data;
            set((state) => ({
                directorData: [...state.directorData, newData],
            }));
        } catch (error: any) {
            set({ error: error.message });
        }
    },

    deleteDirectorData: async (id: number, companyId: string) => {
        try {
            const response = await deleteData(id, companyId);
            if (!response.data) {
                throw new Error("Failed to delete director data.");
            }
            set((state) => ({
                directorData: state.directorData.filter((data) => data.id !== id),
            }));
        } catch (error: any) {
            set({ error: error.message });
        }
    },

    updateDirectorData: async (directorData: DirectorUpdateProps, companyId: string) => {
        try {
            const response = await updateData(directorData, companyId);
            if (!response.data) {
                throw new Error("Failed to update director data.");
            }
            const updatedData = response.data;
            set((state) => ({
                directorData: state.directorData.map((data) =>
                    data.id === updatedData.id ? updatedData : data
                ),
            }));
        } catch (error: any) {
            set({ error: error.message });
        }
    },
}));
