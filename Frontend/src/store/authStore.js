import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from "./axios";

const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            loading: false,
            error: null,

            login: async (email, password) => {
                try {
                    set({ loading: true, error: null });
                    const res = await axios.post("/auth/login", { email, password });

                    const { token, ...userData } = res.data;
                    localStorage.setItem("token", token);

                    set({ user: userData, loading: false });
                    return true;
                } catch (err) {
                    set({
                        error: err.response?.data?.message || "Login failed. Please try again.",
                        loading: false,
                    });
                    return false;
                }
            },

            register: async (data) => {
                try {
                    set({ loading: true, error: null });
                    const res = await axios.post("/auth/register", data);
                    set({ loading: false });
                    return res.data;
                } catch (err) {
                    set({
                        error: err.response?.data?.message || "Registration failed.",
                        loading: false,
                    });
                    return null;
                }
            },

            logout: () => {
                localStorage.removeItem("token");
                set({ user: null, error: null });
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);

export default useAuthStore;