import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import { AlertCircle, LogOut, User, Bell, Search } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import GlobalSearch from './GlobalSearch';
import NotificationDropdown from './NotificationDropdown';

const Navbar: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { theme } = useTheme();

  if (!session) return null;

  return (
    <nav className="bg-white shadow-md" style={{ backgroundColor: theme.backgroundColor }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/dashboard" className="flex-shrink-0 flex items-center">
              <AlertCircle className="h-8 w-8" style={{ color: theme.primaryColor }} />
              <span className="ml-2 font-bold text-xl" style={{ color: theme.textColor }}>Incident Manager</span>
            </Link>
          </div>
          <div className="flex items-center">
            <GlobalSearch />
            <NotificationDropdown />
            <div className="ml-3 relative">
              <div>
                <button
                  className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  id="user-menu"
                  aria-haspopup="true"
                >
                  <span className="sr-only">Open user menu</span>
                  <User className="h-8 w-8 rounded-full" />
                </button>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <LogOut className="inline-block w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;