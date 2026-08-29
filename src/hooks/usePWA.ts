import { useState, useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      if (!registration) return;
      console.log('VyLab SW Registered:', swUrl);

      // 1. Proactive periodic check every 30 minutes
      const intervalId = setInterval(() => {
        if (navigator.onLine) {
          registration.update().catch(err => console.warn('Periodic SW update check failed:', err));
        }
      }, 30 * 60 * 1000);

      // 2. Check for updates whenever user returns to the tab/app
      const checkUpdateOnFocus = () => {
        if (document.visibilityState === 'visible' && navigator.onLine) {
          registration.update().catch(err => console.warn('Focus SW update check failed:', err));
        }
      };

      document.addEventListener('visibilitychange', checkUpdateOnFocus);
      window.addEventListener('focus', checkUpdateOnFocus);
    },
    onRegisterError(error) {
      console.error('VyLab SW Registration error:', error);
    },
  });

  useEffect(() => {
    // Detect standalone mode (PWA installed & running as app)
    const checkStandalone = () => {
      const isStandaloneMode = 
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://');
      setIsStandalone(isStandaloneMode);
    };

    checkStandalone();

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for appinstalled
    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
      setIsStandalone(true);
      console.log('VyLab PWA installed successfully!');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const triggerInstall = async () => {
    if (isIOS) {
      setShowIOSPrompt(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted PWA installation');
      setIsInstallable(false);
      setDeferredPrompt(null);
    } else {
      console.log('User dismissed PWA installation');
    }
  };

  return {
    isInstallable: isInstallable || (isIOS && !isStandalone),
    isStandalone,
    isIOS,
    showIOSPrompt,
    setShowIOSPrompt,
    triggerInstall,
    needRefresh,
    offlineReady,
    updateServiceWorker: () => updateServiceWorker(true),
    dismissUpdate: () => setNeedRefresh(false),
    dismissOfflineReady: () => setOfflineReady(false),
  };
}
