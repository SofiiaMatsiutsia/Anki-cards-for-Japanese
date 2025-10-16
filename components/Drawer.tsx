import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  triggerRef?: React.RefObject<HTMLElement>;
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, children, triggerRef }) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    // Focus trapping
    const focusableElements = drawerRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements && focusableElements.length > 0) {
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      firstElement.focus();

      const handleTabKeyPress = (event: KeyboardEvent) => {
        if (event.key === 'Tab') {
          if (event.shiftKey) { // Shift + Tab
            if (document.activeElement === firstElement) {
              event.preventDefault();
              lastElement.focus();
            }
          } else { // Tab
            if (document.activeElement === lastElement) {
              event.preventDefault();
              firstElement.focus();
            }
          }
        }
      };
      
      document.addEventListener('keydown', handleTabKeyPress);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keydown', handleTabKeyPress);
        document.body.style.overflow = 'auto';
        triggerRef?.current?.focus();
      };
    }
    
    // Fallback cleanup if no focusable elements
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
      triggerRef?.current?.focus();
    };

  }, [isOpen, onClose, triggerRef]);

  if (typeof document === 'undefined') {
    return null;
  }
  
  return ReactDOM.createPortal(
    <div
      className={`fixed inset-0 z-40 transition-opacity duration-300 ease-in-out ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      aria-hidden={!isOpen}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-label="Close settings"
      />

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        className={`fixed top-0 left-0 flex flex-col h-full w-full max-w-xs bg-slate-800 border-r border-slate-700 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <header className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0 bg-slate-900">
          <h2 id="drawer-title" className="text-xl font-semibold text-sky-400">
            Customize Deck
          </h2>
          <button
            onClick={onClose}
            aria-label="Close settings"
            className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="overflow-y-auto">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Drawer;