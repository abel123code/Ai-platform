// components/LayoutWrapper.js
'use client';

import { useState } from 'react';
import NavBar from './NavBar';
import MobileMenu from './MobileMenu';
import { useSession } from 'next-auth/react';

const LayoutWrapper = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <div className="relative">
      <NavBar
        toggleMobileMenu={toggleMobileMenu}
        mobileMenuOpen={mobileMenuOpen}
      />
      {mobileMenuOpen && (
        <MobileMenu
          session={session}
          toggleMobileMenu={toggleMobileMenu}
        />
      )}
      <div
        className={`transition-all duration-300`}
      >
        {children}
      </div>
    </div>
  );
};

export default LayoutWrapper;
