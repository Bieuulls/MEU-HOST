import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';

export const Header: React.FC = () => {
  const { theme } = useTheme();
  const { header } = theme;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const promoMessages = [
    { text: 'Free shipping on orders over $50', type: 'shipping' },
    { text: '20% OFF on your first purchase - Use code: WELCOME20', type: 'discount' },
    { text: 'Limited time offer - Buy 2 Get 1 Free', type: 'promotion' },
    { text: 'New collection arriving soon!', type: 'announcement' },
    { text: 'Members get extra 10% OFF', type: 'membership' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromoIndex((prev) => (prev + 1) % promoMessages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getCurrentPromoColor = () => {
    const types = {
      shipping: { bg: '#EBF5FF', text: '#1E40AF' },
      discount: { bg: '#FEF3C7', text: '#92400E' },
      promotion: { bg: '#FCE7F3', text: '#831843' },
      announcement: { bg: '#ECFDF5', text: '#065F46' },
      membership: { bg: '#F3E8FF', text: '#6B21A8' }
    };
    return types[promoMessages[currentPromoIndex].type as keyof typeof types];
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`w-full sticky top-0 z-50 transition-shadow duration-300 ${isScrolled ? 'shadow-md' : 'shadow-sm'}`}
      onKeyDown={handleKeyPress}
    >
      {header.showTopBar && (
        <div
          className="w-full py-1.5 sm:py-2 text-center text-xs sm:text-sm font-medium tracking-wide transition-all duration-500 transform"
          style={{
            backgroundColor: getCurrentPromoColor().bg,
            color: getCurrentPromoColor().text
          }}
          role="banner"
        >
          <p className="animate-fade-in">{promoMessages[currentPromoIndex].text}</p>
        </div>
      )}

      <div
        className={`w-full py-4 ${header.borderBottom ? 'border-b' : ''} backdrop-blur-md transition-colors duration-300 ${isScrolled ? 'bg-white/95' : 'bg-white/90'}`}
        style={{
          borderColor: header.borderColor
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 lg:gap-12">
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden hover:opacity-80 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMobileMenuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18"/>
                    <path d="m6 6 12 12"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" x2="20" y1="12" y2="12"/>
                    <line x1="4" x2="20" y1="6" y2="6"/>
                    <line x1="4" x2="20" y1="18" y2="18"/>
                  </svg>
                )}
              </button>
              <a
                href="/"
                className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md transition-opacity duration-200 hover:opacity-80"
                aria-label="Go to homepage"
              >
                {header.logo ? (
                  <img
                    src={header.logo}
                    alt="Store logo"
                    className="h-8 md:h-10 w-auto object-contain"
                  />
                ) : (
                  <span
                    className="text-xl md:text-2xl font-bold tracking-tight"
                    style={{ color: header.menuText }}
                  >
                    MEGA
                  </span>
                )}
              </a>
              <nav
                id="desktop-menu"
                className="hidden lg:flex items-center gap-8"
                role="navigation"
                aria-label="Main navigation"
              >
                {header.navigation.items.map((item, index) => (
                  <a
                    key={index}
                    href={item.url}
                    className="text-sm font-medium hover:text-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-3"
                    style={{ color: header.menuText }}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
            </div>

            <nav
              id="mobile-menu"
              className={`
                lg:hidden
                fixed
                inset-0 top-[57px]
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                transition-transform duration-300 ease-in-out
                flex flex-col
                p-6
                overflow-y-auto
                z-40
                h-[calc(100vh-57px)]
                bg-white/95 backdrop-blur-md
                border-t border-gray-200
              `}
              role="navigation"
              aria-label="Mobile navigation"
            >
              <div className="flex flex-col gap-4">
                {header.navigation.items.map((item, index) => (
                  <a
                    key={index}
                    href={item.url}
                    className="block py-2 text-base font-medium hover:text-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-3 w-full text-left"
                    style={{ color: header.menuText }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.text}
                  </a>
                ))}
              </div>
              <div className="flex flex-col gap-4 mt-8 border-t pt-6 w-full">
                <button
                  className="flex items-center gap-2 text-base font-medium hover:text-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-3 w-full"
                  style={{ color: header.icons?.color }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.3-4.3"/>
                  </svg>
                  <span>Search</span>
                </button>
                <button
                  className="flex items-center gap-2 text-base font-medium hover:text-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-3 w-full"
                  style={{ color: header.icons?.color }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <span>Account</span>
                </button>
              </div>
            </nav>

            <div className="flex items-center gap-6">
              <button
                className="hidden sm:flex items-center gap-2 text-sm font-medium hover:text-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
                style={{ color: header.icons?.color }}
                aria-label="Search products"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.3-4.3"/>
                </svg>
                <span>Search</span>
              </button>
              <button
                className="hidden sm:flex items-center gap-2 text-sm font-medium hover:text-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
                style={{ color: header.icons?.color }}
                aria-label="View account"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span>Account</span>
              </button>
              <button
                className="flex items-center gap-2 text-sm font-medium hover:text-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1 relative"
                style={{ color: header.icons?.color }}
                aria-label="View shopping cart"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                  <path d="M3 6h18"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                <span className="hidden sm:inline">Cart</span>
                <span
                  className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center transition-all duration-300"
                  aria-label="Cart items count"
                >0</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};