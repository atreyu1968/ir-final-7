import { useState, useEffect } from 'react';

interface SystemStatus {
  application: boolean;
  database: boolean;
  network: boolean;
}

export const useSystemStatus = () => {
  const [status, setStatus] = useState<SystemStatus>({
    application: true,
    database: true,
    network: true,
  });
  const [lastCheck, setLastCheck] = useState<Date>(new Date());
  const [checking, setChecking] = useState(false);

  const checkStatus = async () => {
    setChecking(true);
    try {
      const [appResponse, dbResponse, networkResponse] = await Promise.all([
        fetch('/api/health'),
        fetch('/api/health/database'),
        fetch('/api/health/network'),
      ]);

      setStatus({
        application: appResponse.ok,
        database: dbResponse.ok,
        network: networkResponse.ok,
      });
    } catch (error) {
      console.error('Error checking system status:', error);
      setStatus({
        application: false,
        database: false,
        network: false,
      });
    } finally {
      setLastCheck(new Date());
      setChecking(false);
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  return {
    status,
    lastCheck,
    checking,
    checkStatus,
  };
};