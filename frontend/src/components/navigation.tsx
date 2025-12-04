import React, { useState, useEffect } from 'react';
import Logo from '../images/padei_logo.png';
import { Link, NavLink as RouterNavLink, useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { ConnectWallet } from './wallet/ConnectWallet';
import { useActiveAccount } from 'thirdweb/react';
import { isAdmin } from '@/config/admins';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const account = useActiveAccount();
  const navigate = useNavigate();
  const isConnected = !!account;
  const userIsAdmin = isAdmin(account?.address);

  // Auto-navigate to appropriate dashboard when wallet connects
  useEffect(() => {
    if (isConnected && window.location.pathname === '/') {
      // Navigate to admin or user dashboard based on role
      const targetRoute = userIsAdmin ? '/mentors-admin' : '/dashboard';
      navigate(targetRoute);
    }
  }, [isConnected, userIsAdmin, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scroll = totalScroll / windowHeight;
      setScrollProgress(scroll * 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/features', label: 'Features' },
    { to: '/how-it-works', label: 'How it works' },
    { to: '/about', label: 'About' },
  ];

  return (
    <>
      <nav className="bg-black md:bg-card/80 backdrop-blur-lg border-b border-border flex items-center justify-between px-6 py-4 fixed top-0 left-0 right-0 z-50">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={Logo}
            alt="Preshot Logo"
            className="w-8 h-8 rounded-full"
          />
          <span className="font-bold text-lg hidden sm:inline">Preshot</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 md:py-8">
          {navLinks.map((link) => (
            <RouterNavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium hover:text-primary transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`
              }
            >
              {link.label}
            </RouterNavLink>
          ))}
        </div>

        {/* Desktop Connect Button */}
        <div className="hidden md:flex">
          <ConnectWallet />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="p-2">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="flex flex-col space-y-6 mt-8">
                {navLinks.map((link) => (
                  <RouterNavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `text-base font-medium hover:text-primary transition-colors ${
                        isActive ? 'text-primary' : 'text-foreground'
                      }`
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </RouterNavLink>
                ))}
                <div className="pt-4 border-t border-border">
                  <ConnectWallet />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        {/* Scroll Progress Bar */}
      <div className="md:hidden fixed top-[70px] left-0 w-full h-1.5 bg-secondary z-50">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      </nav>
      
      {/* Scroll Progress Bar */}
      <div className="hidden md:block md:fixed md:top-[107px] left-0 w-full h-1.5 bg-secondary z-50">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </>
  );
};

export default Navigation;
