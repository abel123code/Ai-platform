'use client';

import Link from 'next/link';
import { Button } from './ui/Button';
import { signOut } from 'next-auth/react';

const MobileMenu = ({ session, toggleMobileMenu }) => {
  return (
    <div className="lg:hidden bg-gray-800 w-full z-20 text-white">
      <nav className="flex flex-col items-center py-4 space-y-4">
        <Link
          href="/"
          className="hover:text-blue-500 transition-colors"
          onClick={toggleMobileMenu}
        >
          About us
        </Link>
        {!session && (<Link href={'/teach-with-us/learn-more'} >
          <Button variant="ghost" className="hover:text-blue-500">
            Teach With Us
          </Button>
        </Link>)}
        {session ? (
          <>
            <Link
              href="/home"
              className="hover:text-blue-500 transition-colors"
              onClick={toggleMobileMenu}
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
              onClick={() => {
                signOut();
                toggleMobileMenu();
              }}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="hover:text-blue-500 transition-colors"
              onClick={toggleMobileMenu}
            >
              Login
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default MobileMenu;
