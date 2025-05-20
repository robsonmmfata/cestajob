
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, Store, ShoppingCart, Book, DollarSign, Menu, X, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';

interface NavItemProps {
  icon: React.ReactNode;
  text: string;
  active: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, text, active, onClick }) => (
  <Button
    variant="ghost"
    className={`flex items-center gap-2 py-2 px-4 w-full justify-start ${active ? 'bg-secondary text-secondary-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}
    onClick={onClick}
  >
    {icon}
    <span>{text}</span>
  </Button>
);

export type TabType = 'dashboard' | 'items' | 'baskets' | 'models' | 'finance';

const Navbar = () => {
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout, user } = useAuth();
  const location = useLocation();
  
  const getActiveTab = (): TabType => {
    const path = location.pathname;
    if (path.includes('items')) return 'items';
    if (path.includes('baskets')) return 'baskets';
    if (path.includes('models')) return 'models';
    if (path.includes('finance')) return 'finance';
    return 'dashboard';
  };
  
  const activeTab = getActiveTab();

  const navItems = [
    { id: 'dashboard', text: 'Dashboard', icon: <Store size={20} />, path: '/' },
    { id: 'items', text: 'Itens', icon: <Package size={20} />, path: '/items' },
    { id: 'baskets', text: 'Cestas', icon: <ShoppingCart size={20} />, path: '/baskets' },
    // Removed 'Modelos' menu item as requested
    // { id: 'models', text: 'Modelos', icon: <Book size={20} />, path: '/models' },
    { id: 'finance', text: 'Financeiro', icon: <DollarSign size={20} />, path: '/finance' }
  ];

  const handleTabChange = () => {
    if (isMobile) {
      setMenuOpen(false);
    }
  };

  return (
    <>
      {isMobile ? (
        <div className="bg-primary text-primary-foreground p-4">
          <div className="flex justify-between items-center">
            <div className="font-bold text-lg">Controle de Cestas</div>
            <div className="flex items-center gap-2">
              <div className="text-sm mr-2">
                <User size={16} className="inline mr-1" />
                {user?.username}
              </div>
              <Button variant="ghost" size="icon" onClick={() => logout()}>
                <LogOut size={20} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </div>
          {menuOpen && (
            <div className="mt-4 space-y-1">
              {navItems.map((item) => (
                <Link to={item.path} key={item.id}>
                  <NavItem
                    icon={item.icon}
                    text={item.text}
                    active={activeTab === item.id as TabType}
                    onClick={handleTabChange}
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="w-64 bg-primary text-primary-foreground p-4 flex flex-col h-screen">
          <div className="font-bold text-xl mb-8 text-center">Controle de Cestas</div>
          <div className="space-y-1 flex-1">
            {navItems.map((item) => (
              <Link to={item.path} key={item.id}>
                <NavItem
                  icon={item.icon}
                  text={item.text}
                  active={activeTab === item.id as TabType}
                  onClick={handleTabChange}
                />
              </Link>
            ))}
          </div>
          <div className="border-t border-primary-foreground/20 pt-4 mt-auto">
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center">
                <User size={18} className="mr-2" />
                <span className="text-sm font-medium">{user?.username}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => logout()}>
                <LogOut size={18} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
