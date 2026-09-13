import { useEffect, useState, useRef, useCallback } from 'react';
import { notificationService } from '../services/notificationService';

export interface BackgroundActiveState {
  isOnline: boolean;
  isMinimized: boolean;
  notificationsEnabled: boolean;
  wakeLockActive: boolean;
  lastSyncTime: Date | null;
  notificationPermission: NotificationPermission;
  testScheduled: boolean;
}

export function useBackgroundActive() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isMinimized, setIsMinimized] = useState(
    typeof document !== 'undefined' ? document.visibilityState === 'hidden' : false
  );
  const [permission, setPermission] = useState<NotificationPermission>(() =>
    notificationService.getPermission()
  );
  const [backgroundAlerts, setBackgroundAlerts] = useState<boolean>(() => {
    return localStorage.getItem('xe_background_alerts_enabled') !== 'false';
  });
  const [wakeLockActive, setWakeLockActive] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(new Date());
  const [testCountdown, setTestCountdown] = useState<number | null>(null);

  const backgroundTimerRef = useRef<number | null>(null);
  const testTimerRef = useRef<number | null>(null);

  // Toggle Background Alerts
  const toggleBackgroundAlerts = (enabled: boolean) => {
    setBackgroundAlerts(enabled);
    localStorage.setItem('xe_background_alerts_enabled', enabled ? 'true' : 'false');
  };

  // Enable Notifications
  const requestNotificationPermission = async () => {
    const result = await notificationService.requestPermission();
    setPermission(result);
    if (result === 'granted') {
      notificationService.sendNotification({
        title: '✅ নোটিফিকেশন সক্রিয় হয়েছে!',
        body: 'এখন থেকে অ্যাপ মিনিমাইজ থাকলেও লাইভ কারেন্সি রেট ও নোটিফিকেশন পাবেন।',
        tag: 'xe-permission-granted',
      });
    }
    return result;
  };

  // Toggle Screen WakeLock
  const toggleWakeLock = async (enabled: boolean) => {
    if (enabled) {
      const success = await notificationService.requestWakeLock();
      setWakeLockActive(success);
    } else {
      notificationService.releaseWakeLock();
      setWakeLockActive(false);
    }
  };

  // Trigger Immediate Test Notification
  const sendInstantTestNotification = useCallback(async () => {
    return await notificationService.sendNotification({
      title: '🔔 Xe Currency: রিয়েল-টাইম টেস্ট নোটিফিকেশন',
      body: 'আপনার মোবাইল ডিভাইস ইন্টারনেটের সাথে যুক্ত এবং ব্যাকগ্রাউন্ডে সক্রিয় রয়েছে।',
      tag: 'xe-test-alert',
    });
  }, []);

  // Schedule Delayed Notification to test while app is minimized
  const scheduleMinimizedTestNotification = useCallback((seconds: number = 5) => {
    if (testTimerRef.current) clearInterval(testTimerRef.current);

    setTestCountdown(seconds);
    let remaining = seconds;

    testTimerRef.current = window.setInterval(() => {
      remaining -= 1;
      if (remaining > 0) {
        setTestCountdown(remaining);
      } else {
        if (testTimerRef.current) clearInterval(testTimerRef.current);
        setTestCountdown(null);
        notificationService.sendNotification({
          title: '📲 অ্যাপ মিনিমাইজ থাকা অবস্থায় সফল নোটিফিকেশন!',
          body: 'Xe Currency ব্যাকগ্রাউন্ডে সক্রিয় রয়েছে এবং রিয়েল-টাইমে রেট পর্যবেক্ষণ করছে।',
          tag: 'xe-minimized-success',
        });
      }
    }, 1000);
  }, []);

  // Monitor Network & Visibility
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastSyncTime(new Date());

      if (backgroundAlerts && notificationService.getPermission() === 'granted') {
        notificationService.sendNotification({
          title: '🌐 ইন্টারনেট সংযুক্ত হয়েছে!',
          body: 'লাইভ কারেন্সি এক্সচেঞ্জ রেট এবং রেমিট্যান্স ট্র্যাকিং রিয়েল-টাইমে সক্রিয় রয়েছে।',
          tag: 'xe-online-status',
        });
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      if (backgroundAlerts && notificationService.getPermission() === 'granted') {
        notificationService.sendNotification({
          title: '⚠️ ইন্টারনেট বিচ্ছিন্ন হয়েছে',
          body: 'অ্যাপটি অফলাইন মোডে সংরক্ষিত রেট ব্যবহার করছে। ইন্টারনেট এলে পুনরায় অটো-সিঙ্ক হবে।',
          tag: 'xe-offline-status',
        });
      }
    };

    const handleVisibilityChange = () => {
      const isHidden = document.visibilityState === 'hidden';
      setIsMinimized(isHidden);

      if (isHidden) {
        // App minimized / backgrounded: start periodic background sync check
        if (backgroundTimerRef.current) clearInterval(backgroundTimerRef.current);
        backgroundTimerRef.current = window.setInterval(() => {
          setLastSyncTime(new Date());
          // Heartbeat check or rate alert monitoring
        }, 15000);
      } else {
        // App brought back to foreground
        if (backgroundTimerRef.current) clearInterval(backgroundTimerRef.current);
        setLastSyncTime(new Date());
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (backgroundTimerRef.current) clearInterval(backgroundTimerRef.current);
      if (testTimerRef.current) clearInterval(testTimerRef.current);
    };
  }, [backgroundAlerts]);

  return {
    isOnline,
    isMinimized,
    permission,
    backgroundAlerts,
    wakeLockActive,
    lastSyncTime,
    testCountdown,
    toggleBackgroundAlerts,
    requestNotificationPermission,
    toggleWakeLock,
    sendInstantTestNotification,
    scheduleMinimizedTestNotification,
  };
}
