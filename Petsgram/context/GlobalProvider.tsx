import React, { 
  createContext, 
  useState, 
  useContext, 
  ReactNode 
} from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

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
  const [user, setUser] = useState<any>(null);

  const setSecureItem = async (key: string, value: string) => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value); // Use localStorage for the web
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  };

  const getSecureItem = async (key: string) => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  };

  const deleteSecureItem = async (key: string) => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  };

  const signIn = async (userData: any) => {
    try {
      await setSecureItem('access', String(userData.access));
      await setSecureItem('refresh', String(userData.refresh));
      setUser(userData);
    } catch (e) {
      console.error('Failed to sign in:', e);
    }
  };

  const signOut = async () => {
    try {
      await deleteSecureItem('access_token');
      await deleteSecureItem('refresh_token');
      setUser(null);
    } catch (e) {
      console.error('Failed to sign out:', e);
    }
  };

  const loadUserData = async () => {
    try {
      const storedUser = await getSecureItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Failed to load user data:', e);
    }
  };

  React.useEffect(() => {
    loadUserData();
  }, []);

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
