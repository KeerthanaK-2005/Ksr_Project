import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { storageService } from '../services/storageService';
import { navigationRef } from '../navigation/RootNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialTab, setInitialTab] = useState(null);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    console.log('=== LOGIN DEBUG START ===');
    try {
      const { status, data } = await authService.login(email, password);
      console.log('Login API result:', data, 'Status:', status);
      // Debug log: full login API response
      console.log('Login API full response:', { status, data });
      if (status === 200 && data && (data.accessToken || data.token)) {
        // Store each user field as a separate key
        await storageService.setItem('userId', data.userId || data.id || '');
        await storageService.setItem('firstName', data.firstName || '');
        await storageService.setItem('lastName', data.lastName || data.lastname || '');
        await storageService.setItem('email', data.email || data.userEmail || '');
        await storageService.setItem('roleId', data.roleId || '');
        await storageService.setItem('accessToken', data.accessToken || data.token);
        // Optionally remove userDetails if not needed
        await storageService.removeItem('userDetails');
        await storageService.removeItem('userName');
        setToken(data.accessToken || data.token);
        setUser({
          userId: data.userId || data.id || '',
          firstName: data.firstName || '',
          lastName: data.lastName || data.lastname || '',
          email: data.email || data.userEmail || '',
          roleId: data.roleId || '',
        });
        setInitialTab('Stories');
        // Debug: log stored values
        const allKeys = await AsyncStorage.getAllKeys();
        const vivaahKeys = allKeys.filter(key => key.startsWith('VivaahAI_'));
        const vivaahValues = await AsyncStorage.multiGet(vivaahKeys);
        console.log('All VivaahAI_ storage:', vivaahValues);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      // Debug log: print error details
      if (error.response) {
        console.error('Login error response:', error.response.data);
      }
      console.log('=== LOGIN DEBUG END ===');
      return false;
    }
  };

  const logout = async () => {
    try {
      await storageService.clearAll();
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn: !!token,
        isLoading,
        login,
        logout,
        initialTab,
        setInitialTab,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 