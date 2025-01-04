// components/NavBar.js
'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { BookOpen, Menu, X } from 'lucide-react';
import { Button } from './ui/Button';


const NavBar = ({ toggleMobileMenu, mobileMenuOpen }) => {
  const { data: session } = useSession();

  return (
    <header className="border-b border-gray-400 relative z-10 bg-gray-800 text-white">
      <div className="container mx-auto px-2 md:px-6">
        <nav className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-4 hover:text-blue-500 transition-colors"
          >
            <BookOpen className="h-8 w-8 text-blue-500" />
            <span className="text-xl font-bold">IntelliLearn Studios</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-6 items-center">
            <Link href="/" className="hover:text-blue-500 transition-colors">
              About us
            </Link>
            {/* Dropdown Menu */}
            {/* {!session && (<Link href={'/teach-with-us/learn-more'} >
              <Button variant="ghost" className="hover:text-blue-500">
                Teach With Us
              </Button>
            </Link>)} */}

            {session ? (
              <>
                <Link
                  href="/home"
                  className="hover:text-blue-500 transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/my-courses"
                  className="hover:text-blue-500 transition-colors"
                >
                  My Courses
                </Link>
                {/* <Link href={'/teach-with-us/learn-more'} >
                  <Button variant="ghost" className="hover:text-blue-500">
                    Teach With Us
                  </Button>
                </Link> */}
                <Button
                  variant="outline"
                  className="text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white"
                  onClick={() => signOut()}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hover:text-blue-500 transition-colors"
                >
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            className="lg:hidden"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
