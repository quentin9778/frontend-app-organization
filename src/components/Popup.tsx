// Popup.tsx
import React from 'react';

type PopupProps = {
  title: string;
  isOpen: boolean;
  children: React.ReactNode;
};

const Popup: React.FC<PopupProps> = ({ title, isOpen, children }) => {
    if (!isOpen) return null;
  
    return (
      <div style={{
        position: 'fixed',
        backgroundColor: 'indigo',
        color:'white',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '20px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
      }}>
        <h2 style={{color: '#fff'}}>{title}</h2>
        {children}
      </div>
    );
  };
  

export default Popup;
