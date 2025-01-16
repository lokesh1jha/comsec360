import { useAuthStore } from "@/services/authStore";


export const loadAuthFromLocalStorage = () => {
  if (typeof window === 'undefined') return; // Ensure this runs only in the browser

  const token = localStorage.getItem('token');
  const type = localStorage.getItem('type');

  if (token && type) {
    useAuthStore.setState(() => ({ token: token, type: type }));
  }
console.log(useAuthStore.getState(), "useAuthStore.getState()");
  return { token, type };
};
