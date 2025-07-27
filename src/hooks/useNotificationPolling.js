import { useEffect, useRef } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { useUser } from '../contexts/UserContext';

/**
 * Hook để polling thông báo mới từ backend
 * Sẽ tự động kiểm tra thông báo mới mỗi 30 giây
 */
export const useNotificationPolling = (pollingInterval = 30000) => {
  const { refreshNotifications } = useNotifications();
  const { userId } = useUser();
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!userId) {
      // Clear interval khi user logout
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Setup polling
    const startPolling = () => {
      intervalRef.current = setInterval(() => {
        refreshNotifications();
      }, pollingInterval);
    };

    // Bắt đầu polling
    startPolling();

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [userId, pollingInterval, refreshNotifications]);

  // Provide manual refresh function
  const manualRefresh = () => {
    refreshNotifications();
  };

  return { manualRefresh };
};

export default useNotificationPolling;
