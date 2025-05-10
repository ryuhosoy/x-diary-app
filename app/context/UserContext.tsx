'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type UserContextType = {
  userId: string | null;
  username: string | null;
  setUserInfo: (userId: string, username: string) => void;
  clearUserInfo: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // Check URL parameters for userId
    const urlParams = new URLSearchParams(window.location.search);
    const urlUserId = urlParams.get('userId');
    
    if (urlUserId) {
      // Store userId in localStorage
      localStorage.setItem('user_id', urlUserId);
      // Remove userId from URL
      window.history.replaceState({}, '', window.location.pathname);
    }

    // Get userId from localStorage
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      setUserId(storedUserId);
    }

    // Fetch user info if we have a userId
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          const data = await response.json();
          console.log("ユーザー情報:", data);
          setUsername(data.username);
        }
      } catch (error) {
        console.error('ユーザー情報の取得に失敗:', error);
      }
    };

    if (storedUserId) {
      fetchUserInfo();
    }
  }, []);

  const setUserInfo = (newUserId: string, newUsername: string) => {
    localStorage.setItem('user_id', newUserId);
    setUserId(newUserId);
    setUsername(newUsername);
  };

  const clearUserInfo = () => {
    localStorage.removeItem('user_id');
    setUserId(null);
    setUsername(null);
  };

  return (
    <UserContext.Provider value={{ userId, username, setUserInfo, clearUserInfo }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 