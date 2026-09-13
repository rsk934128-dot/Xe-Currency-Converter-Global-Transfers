// Notification and Background Service for Mobile and Desktop

export interface NotificationPayload {
  title: string;
  body: string;
  tag?: string;
  data?: Record<string, any>;
}

class NotificationService {
  private wakeLockSentinel: any = null;

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  public getPermission(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  public async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) return 'denied';
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (err) {
      console.warn('Could not request notification permission:', err);
      return 'denied';
    }
  }

  public async sendNotification(payload: NotificationPayload): Promise<boolean> {
    if (!this.isSupported()) return false;

    if (Notification.permission !== 'granted') {
      const requested = await this.requestPermission();
      if (requested !== 'granted') return false;
    }

    try {
      // 1. Try Service Worker Registration for background/minimized mobile notifications
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        if (registration && 'showNotification' in registration) {
          await registration.showNotification(payload.title, {
            body: payload.body,
            icon: '/pwa-192x192.png',
            badge: '/pwa-192x192.png',
            tag: payload.tag || 'xe-currency-alert',
            vibrate: [200, 100, 200],
            data: payload.data || { url: '/' },
          } as NotificationOptions);
          return true;
        }
      }

      // 2. Fallback to standard window Notification
      const notif = new Notification(payload.title, {
        body: payload.body,
        icon: '/pwa-192x192.png',
        tag: payload.tag || 'xe-currency-alert',
      });
      notif.onclick = () => {
        window.focus();
        notif.close();
      };
      return true;
    } catch (err) {
      console.warn('Failed to dispatch notification:', err);
      return false;
    }
  }

  // Screen WakeLock support to prevent screen sleep while viewing rates
  public async requestWakeLock(): Promise<boolean> {
    if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
      try {
        this.wakeLockSentinel = await (navigator as any).wakeLock.request('screen');
        this.wakeLockSentinel.addEventListener('release', () => {
          this.wakeLockSentinel = null;
        });
        return true;
      } catch (err) {
        console.warn('WakeLock request error:', err);
        return false;
      }
    }
    return false;
  }

  public releaseWakeLock(): void {
    if (this.wakeLockSentinel) {
      this.wakeLockSentinel.release().catch(() => {});
      this.wakeLockSentinel = null;
    }
  }

  public isWakeLockActive(): boolean {
    return this.wakeLockSentinel !== null;
  }
}

export const notificationService = new NotificationService();
