import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  authenticate: (passcode: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());

  // Check session on mount and every minute
  useEffect(() => {
    const checkSession = () => {
      const session = localStorage.getItem('adminSession');
      if (session) {
        const { timestamp, expiry } = JSON.parse(session);
        const now = Date.now();
        
        // Check if session is expired or inactive for more than 30 minutes
        if (now > expiry || now - timestamp > 30 * 60 * 1000) {
          localStorage.removeItem('adminSession');
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Update last activity on user interaction
  useEffect(() => {
    const updateActivity = () => setLastActivity(Date.now());
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('click', updateActivity);

    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('click', updateActivity);
    };
  }, []);

  const authenticate = async (passcode: string): Promise<boolean> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ passcode }),
      });

      if (response.ok) {
        const now = Date.now();
        const session = {
          timestamp: now,
          expiry: now + 3 * 60 * 60 * 1000, // 3 hours from now
        };
        localStorage.setItem('adminSession', JSON.stringify(session));
        setIsAuthenticated(true);
        setLastActivity(now);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Authentication error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminSession');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, authenticate, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 