import React, { ReactNode, useEffect } from 'react';
import { modal } from '../styles';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={modal.overlay}
      onClick={onClose}
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className={modal.backdrop}
          onClick={onClose}
        />

        <div
          className={`${modal.container} ${modal.size[size]}`}
          onClick={(e) => e.stopPropagation()}
        >
          {title && (
            <div className={modal.header}>
              <h3 className={modal.title}>{title}</h3>
            </div>
          )}
          <div className={modal.body}>{children}</div>
        </div>
      </div>
    </div>
  );
};
