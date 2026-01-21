// Simple Toast Notification Utility
const toastContainer = () => {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 400px;
    `;
    document.body.appendChild(container);
  }
  return container;
};

const createToast = (message, type = 'info', duration = 3000) => {
  const container = toastContainer();
  
  const toast = document.createElement('div');
  const bgColor = {
    success: '#10b981',
    error: '#ef4444',
    info: '#3b82f6',
    warning: '#f59e0b',
    loading: '#8b5cf6'
  }[type] || '#3b82f6';

  const icon = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
    loading: '⌛'
  }[type] || 'ℹ';

  toast.style.cssText = `
    background-color: ${bgColor};
    color: white;
    padding: 14px 18px;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 10px;
    animation: slideIn 0.3s ease-out;
    min-width: 300px;
  `;

  toast.innerHTML = `
    <span style="font-weight: bold; font-size: 16px;">${icon}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  if (duration > 0 && type !== 'loading') {
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // Add CSS animations if not already added
  if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  return toast;
};

export const toast = {
  success: (message, duration = 3000) => createToast(message, 'success', duration),
  error: (message, duration = 4000) => createToast(message, 'error', duration),
  info: (message, duration = 3000) => createToast(message, 'info', duration),
  warning: (message, duration = 3500) => createToast(message, 'warning', duration),
  loading: (message) => createToast(message, 'loading', 0)
};
