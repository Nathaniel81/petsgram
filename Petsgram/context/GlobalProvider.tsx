import React, { 
  createContext, 
  useState, 
  useContext, 
  ReactNode 
} from 'react';
import * as SecureStore from 'expo-secure-store';

interface AuthContextType {
  user: any;
  signIn: (userData: any) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState(null);

  const signIn = async (userData: any) => {
    try {
      await SecureStore.setItemAsync('access_token', userData.access_token);
      await SecureStore.setItemAsync('refresh_token', userData.refresh_token);
      setUser(userData);
    } catch (e) {
      console.error('Failed to sign in:', e);
    }
  };

  const signOut = async () => {
    try {
      await SecureStore.deleteItemAsync('access_token');
      await SecureStore.deleteItemAsync('refresh_token');
      setUser(null);
    } catch (e) {
      console.error('Failed to sign out:', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
