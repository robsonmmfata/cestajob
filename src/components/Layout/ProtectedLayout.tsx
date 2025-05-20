import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

const ProtectedLayout = () => {
  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Simula carregamento até verificar autenticação
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 200); // ajuste conforme necessário

    return () => clearTimeout(timeout);
  }, [isAuthenticated]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg font-medium">
        Carregando...
      </div>
    );
  }

  // Redireciona se não estiver autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {isMobile ? (
        // Layout Mobile
        <div className="flex flex-col min-h-screen">
          <div className="flex items-center justify-between p-4 border-b">
            <Navbar />
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              aria-label="Alternar tema"
            >
              {theme === 'dark' ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              )}
            </Button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <Outlet />
          </div>
        </div>
      ) : (
        // Layout Desktop
        <div className="flex min-h-screen">
          <Navbar />
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex justify-end mb-4">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                aria-label="Alternar tema"
              >
                {theme === 'dark' ? (
                  <Sun className="h-[1.2rem] w-[1.2rem]" />
                ) : (
                  <Moon className="h-[1.2rem] w-[1.2rem]" />
                )}
              </Button>
            </div>
            <Outlet />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProtectedLayout;
