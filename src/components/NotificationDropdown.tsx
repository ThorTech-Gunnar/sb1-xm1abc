import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import theme from '@/styles/theme';

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', message: 'New case assigned', type: 'info' },
    { id: '2', message: 'Case #1234 updated', type: 'success' },
  ]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleRemoveNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="relative p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-full transition duration-200"
        style={{ focusRingColor: theme.colors.primary }}
      >
        <Bell size={20} />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 rounded-full" style={{ backgroundColor: theme.colors.error }}>
            {notifications.length}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20" style={{ borderColor: theme.colors.textLight }}>
          <div className="py-2">
            {notifications.length === 0 ? (
              <div className="px-4 py-2 text-sm" style={{ color: theme.colors.textLight }}>No new notifications</div>
            ) : (
              notifications.map((notification) => (
                <div key={notification.id} className="px-4 py-2 border-b last:border-b-0" style={{ borderColor: theme.colors.textLight }}>
                  <div className="flex justify-between items-center">
                    <p className="text-sm" style={{ color: theme.colors.text }}>{notification.message}</p>
                    <button
                      onClick={() => handleRemoveNotification(notification.id)}
                      className="text-xs hover:text-gray-600 transition duration-200"
                      style={{ color: theme.colors.textLight }}
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;