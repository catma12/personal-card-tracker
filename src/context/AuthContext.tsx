import React, { createContext, useContext } from 'react';

const PERSONAL_USER_ID = 'addab5a7-8243-47b1-9e56-64e7e9b6fd59';

const mockUser = {
  id: PERSONAL_USER_ID,
  email: '',
  user_metadata: { display_name: 'Catherine' },
} as any;

interface AuthContextType {
  user: typeof mockUser;
  session: null;
  loading: false;
  signIn: () => Promise<void>;
  signUp: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: mockUser,
  session: null,
  loading: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthContext.Provider value={{ user: mockUser, session: null, loading: false, signIn: async () => {}, signUp: async () => {}, signOut: async () => {} }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
