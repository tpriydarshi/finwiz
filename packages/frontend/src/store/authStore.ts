import create from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setAuth: (user: User, token: string) =>
    set({
      user,
      token,
      isAuthenticated: true,
    }),
  clearAuth: () =>
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    }),
}));
