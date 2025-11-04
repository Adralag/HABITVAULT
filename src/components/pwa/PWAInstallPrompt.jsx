import React, { useEffect, useState } from 'react';

// Minimal inline icons to avoid adding lucide-react dependency
const IconDownload = ({ className = 'w-4 h-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m0 0l-4-4m4 4l4-4M21 12v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6" />
  </svg>
);
const IconX = ({ className = 'w-5 h-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const IconSparkles = ({ className = 'w-3 h-3' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l.356 1.09a1 1 0 00.95.69h1.146c.969 0 1.371 1.24.588 1.81l-.927.67a1 1 0 00-.364 1.118l.356 1.09c.3.921-.755 1.688-1.538 1.118l-.927-.67a1 1 0 00-1.176 0l-.927.67c-.783.57-1.838-.197-1.538-1.118l.356-1.09a1 1 0 00-.364-1.118l-.927-.67c-.783-.57-.38-1.81.588-1.81h1.146a1 1 0 00.95-.69l.356-1.09z" />
  </svg>
);
const IconHeart = ({ className = 'w-3 h-3' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 21s-7-4.35-9-7.14C1.64 11.6 3.28 7 7.5 7c2.04 0 3.15 1.1 4.5 2.6C12.85 8.1 13.96 7 16 7 20.22 7 21.86 11.6 21 13.86 19 16.65 12 21 12 21z" />
  </svg>
);

const PWAInstallPrompt = ({ open = true, onClose = () => {} }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(open);
  const [animeImages, setAnimeImages] = useState([]);

  useEffect(() => {
    setVisible(open);
  }, [open]);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      // Save event locally and globally
      try {
        if (typeof window !== 'undefined') window.__HABITVAULT_deferredPrompt = e;
      } catch (err) {
        // ignore
      }
      setDeferredPrompt(e);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // If a global deferred prompt was already captured (src/pwa.js), use it
    try {
      if (typeof window !== 'undefined' && window.__HABITVAULT_deferredPrompt) {
        setDeferredPrompt(window.__HABITVAULT_deferredPrompt);
        setVisible(true);
      }
    } catch (err) {
      // ignore
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Try to load a few images from the project's assets folder as background (fallback to logo if missing)
  useEffect(() => {
    const assets = [
      '/src/assets/logo-no-bg.png',
    ];
    setAnimeImages(assets.slice(0, 3));
  }, []);

  const handleInstallClick = async () => {
    // Respect session dismiss
    if (sessionStorage.getItem('pwa-install-dismissed')) {
      setVisible(false);
      onClose();
      return;
    }

    const promptToUse = deferredPrompt || (typeof window !== 'undefined' && window.__HABITVAULT_deferredPrompt) || null;
    if (!promptToUse) {
      // show fallback
      setVisible(true);
      return;
    }

    try {
      promptToUse.prompt();
      const choice = await promptToUse.userChoice;
      if (choice.outcome === 'accepted') {
        console.log('User accepted install');
      } else {
        console.log('User dismissed install');
      }
      setDeferredPrompt(null);
      try { if (typeof window !== 'undefined') window.__HABITVAULT_deferredPrompt = null; } catch (e) { }
    } catch (err) {
      console.warn('install prompt failed', err);
    }

    setVisible(false);
    onClose();
  };

  const handleDismiss = () => {
    sessionStorage.setItem('pwa-install-dismissed', 'true');
    setVisible(false);
    onClose();
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 animate-slide-up">
      <div className="relative bg-black border border-slate-700/30 rounded-2xl shadow-lg overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="flex h-full">
            {animeImages.map((image, i) => (
              <div key={i} className="flex-1 h-full bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
            ))}
          </div>
        </div>

        <div className="relative p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12 bg-white rounded-xl overflow-hidden">
                <img src="/src/assets/logo.png" alt="logo" className="w-full h-full object-cover" />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
                  <IconSparkles className="w-3 h-3 text-white" />
                </div>
              </div>

              <div>
                <h3 className="font-bold text-white text-lg">HabitVault</h3>
                <p className="text-sm text-slate-300">Install App</p>
              </div>
            </div>

            <button onClick={handleDismiss} className="text-slate-300 hover:text-white p-1 rounded-lg">
              <IconX />
            </button>
          </div>

          <div className="mb-4">
            <p className="text-slate-300 text-sm mb-2">✨ Use HabitVault offline and get faster access.</p>
            <div className="flex items-center space-x-4 text-xs text-slate-300">
              <div className="flex items-center space-x-1">
                <IconHeart />
                <span>Offline reading</span>
              </div>
              <div className="flex items-center space-x-1">
                <IconDownload />
                <span>Faster access</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button onClick={handleInstallClick} className="flex-1 bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-bold py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2">
              <IconDownload className="w-4 h-4" />
              <span>Install Now</span>
            </button>
            <button onClick={handleDismiss} className="px-4 py-3 text-slate-300 hover:text-white transition-colors border border-slate-700 rounded-xl">
              Later
            </button>
          </div>

          <div className="mt-4 flex justify-center">
            <div className="h-1 w-16 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-400 rounded-full opacity-60"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;