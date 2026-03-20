import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-lg w-full p-4">
        <div className="flex justify-between items-center mb-2">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          <button aria-label="Cerrar modal" onClick={onClose} className="ml-2">×</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
