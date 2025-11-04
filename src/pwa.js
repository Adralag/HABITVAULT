import { registerSW } from 'virtual:pwa-register';

// This is the service worker registration
// It will automatically update when a new version is available
const updateSW = registerSW({
  onNeedRefresh() {
    // This function will be called when a new service worker is available
    if (confirm('New content available. Reload?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('App ready to work offline');
    // You can show a notification to the user that the app is ready for offline use
    showOfflineReadyNotification();
  },
});

function showOfflineReadyNotification() {
  // Create a notification element
  const notification = document.createElement('div');
  notification.className = 'offline-notification';
  notification.innerHTML = `
    <div class="offline-notification-content">
      <p>App is ready for offline use</p>
      <button class="offline-notification-close">Close</button>
    </div>
  `;

  // Style the notification
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.right = '20px';
  notification.style.backgroundColor = '#1E40AF'; // primary color
  notification.style.color = 'white';
  notification.style.padding = '15px 20px';
  notification.style.borderRadius = '8px';
  notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
  notification.style.zIndex = '1000';
  notification.style.opacity = '0';
  notification.style.transform = 'translateY(20px)';
  notification.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

  // Style the button
  const closeButton = notification.querySelector('.offline-notification-close');
  closeButton.style.backgroundColor = 'transparent';
  closeButton.style.border = '1px solid white';
  closeButton.style.color = 'white';
  closeButton.style.padding = '5px 10px';
  closeButton.style.marginLeft = '10px';
  closeButton.style.borderRadius = '4px';
  closeButton.style.cursor = 'pointer';
  
  // Add to DOM
  document.body.appendChild(notification);

  // Show with animation
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
  }, 100);

  // Add close button functionality
  closeButton.addEventListener('click', () => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    
    // Remove from DOM after animation
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  });

  // Auto dismiss after 5 seconds
  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }
  }, 5000);
}

export { updateSW };

// Save a reference to the deferred prompt globally so components that mount
// after the event can still trigger the native prompt.
if (typeof window !== 'undefined') {
  window.__HABITVAULT_deferredPrompt = null;

  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the default mini-infobar from appearing on mobile
    e.preventDefault();
    window.__HABITVAULT_deferredPrompt = e;
    console.debug('pwa.js: saved deferredPrompt to window.__HABITVAULT_deferredPrompt');
  });

  window.addEventListener('appinstalled', () => {
    window.__HABITVAULT_deferredPrompt = null;
    console.debug('pwa.js: appinstalled - cleared deferredPrompt');
  });
}