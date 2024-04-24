import React, { ReactNode } from 'react';

type ModalProps = {
  isOpen: boolean;
  close: () => void;
  children: ReactNode;
};

const Modal: React.FC<ModalProps> = ({ isOpen, close, children }) => {
  if (!isOpen) return null;

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={close} 
    >
      <div 
        className="bg-white rounded-lg p-6 w-full max-w-md relative" 
        onClick={stopPropagation} 
      >
        <button 
          onClick={close} 
          className="absolute top-2 right-2 text-xl"
        >
          ✖
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
