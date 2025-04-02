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
    // 初期ロード時にユーザー情報を取得
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          const data = await response.json();
          console.log("ユーザー情報:", data);
          setUserId(data.id);
          setUsername(data.username);
        }
      } catch (error) {
        console.error('ユーザー情報の取得に失敗:', error);
      }
    };

    fetchUserInfo();
  }, []);

  console.log("userId", userId);
  console.log("username", username);

  const setUserInfo = (newUserId: string, newUsername: string) => {
    setUserId(newUserId);
    setUsername(newUsername);
  };

  const clearUserInfo = () => {
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