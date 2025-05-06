import { create } from "zustand";
import Cookies from "js-cookie";

const TOKEN_COOKIE_NAME = "auth_token";

export const useAuthStore = create((set) => ({
  token: Cookies.get(TOKEN_COOKIE_NAME) || null,
  login: (token) => {
    Cookies.set(TOKEN_COOKIE_NAME, token, { expires: 7, sameSite: "strict" });
    set({ token });
  },
  logout: () => {
    Cookies.remove(TOKEN_COOKIE_NAME);
    set({ token: null });
  },
}));
