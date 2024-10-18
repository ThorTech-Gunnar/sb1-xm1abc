import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BarChart2, FileText, Users, Settings, Map } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { user } = useAuth();

  const menuItems = [
    { name: 'Dashboard', icon: BarChart2, href: '/dashboard', roles: ['admin', 'manager', 'staff'] },
    { name: 'Cases', icon: FileText, href: '/cases', roles: ['admin', 'manager', 'staff'] },
    { name: 'Users', icon: Users, href: '/users', roles: ['admin'] },
    { name: 'Floor Plans', icon: Map, href: '/floor-plans', roles: ['admin', 'manager'] },
    { name: 'Settings', icon: Settings, href: '/settings', roles: ['admin'] },
  ];

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(user?.role || ''));

  return (
    <div className="flex flex-col w-64 bg-white shadow-lg" style={{ backgroundColor: theme.backgroundColor }}>
      <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <img className="h-8 w-auto" src="/logo.svg" alt="Logo" />
        </div>
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {filteredMenuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                router.pathname === item.href
                  ? `bg-${theme.primaryColor} text-white`
                  : `text-${theme.textColor} hover:bg-${theme.secondaryColor} hover:text-white`
              }`}
            >
              <item.icon
                className={`mr-3 flex-shrink-0 h-6 w-6 ${
                  router.pathname === item.href ? 'text-white' : `text-${theme.textColor} group-hover:text-white`
                }`}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;