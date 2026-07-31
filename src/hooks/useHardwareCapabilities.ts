import { useState, useEffect, useCallback } from 'react';

export function useHardwareCapabilities() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wakeLockActive, setWakeLockActive] = useState(false);
  const [wakeLockSentinel, setWakeLockSentinel] = useState<any>(null);

  // 1. Haptics / Vibration
  const vibrate = useCallback((pattern: number | number[] = 15) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (err) {
        // Silently fail if forbidden
      }
    }
  }, []);

  // 2. Fullscreen Toggle
  const toggleFullscreen = useCallback(async (element?: HTMLElement) => {
    const target = element || document.documentElement;
    try {
      if (!document.fullscreenElement) {
        await target.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.warn('Fullscreen error:', err);
    }
  }, []);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // 3. Screen Wake Lock (prevents screen from dimming/sleeping during science experiments)
  const requestWakeLock = useCallback(async () => {
    if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
      try {
        const sentinel = await (navigator as any).wakeLock.request('screen');
        setWakeLockSentinel(sentinel);
        setWakeLockActive(true);
        sentinel.addEventListener('release', () => {
          setWakeLockActive(false);
          setWakeLockSentinel(null);
        });
      } catch (err) {
        console.warn('Wake Lock request failed:', err);
      }
    }
  }, []);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockSentinel) {
      try {
        await wakeLockSentinel.release();
        setWakeLockActive(false);
        setWakeLockSentinel(null);
      } catch (err) {
        console.warn('Wake Lock release failed:', err);
      }
    }
  }, [wakeLockSentinel]);

  // 4. Web Share API
  const shareContent = useCallback(async (shareData: { title: string; text: string; url?: string }) => {
    const urlToShare = shareData.url || window.location.href;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: shareData.title,
          text: shareData.text,
          url: urlToShare,
        });
        return true;
      } catch (err) {
        // User cancelled or share failed
        return false;
      }
    } else {
      // Fallback to clipboard copy
      try {
        await navigator.clipboard.writeText(`${shareData.title}: ${urlToShare}`);
        return 'copied';
      } catch (err) {
        return false;
      }
    }
  }, []);

  return {
    vibrate,
    isFullscreen,
    toggleFullscreen,
    wakeLockActive,
    requestWakeLock,
    releaseWakeLock,
    shareContent,
  };
}
