import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { inputInfoTooltip } from '../styles';

const HOVER_DELAY_MS = 500;

interface InputWithInfoProps {
  children: React.ReactElement;
  /** Texto que se muestra en el cuadro de información (dummy por defecto) */
  infoText?: string;
  /** Clase adicional para el wrapper */
  className?: string;
}

/**
 * Envuelve un input/select/textarea y muestra un cuadro de información
 * cuando el cursor permanece sobre él más de 3 segundos.
 * Usa portal para evitar que overflow:hidden de padres recorte el tooltip.
 */
export const InputWithInfo: React.FC<InputWithInfoProps> = ({
  children,
  infoText = 'Texto de ayuda. Mantenga el cursor aquí para ver más información.',
  className = '',
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 6,
        left: rect.left,
      });
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      updatePosition();
      setShowTooltip(true);
    }, HOVER_DELAY_MS);
  }, [updatePosition]);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setShowTooltip(false);
  }, []);

  useEffect(() => {
    if (showTooltip && wrapperRef.current) {
      updatePosition();
    }
  }, [showTooltip, updatePosition]);

  return (
    <div
      ref={wrapperRef}
      className={`${inputInfoTooltip.wrapper} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {showTooltip &&
        createPortal(
          <div
            className={inputInfoTooltip.box}
            role="tooltip"
            style={{
              position: 'fixed',
              top: position.top,
              left: position.left,
            }}
          >
            <div className={inputInfoTooltip.arrow} aria-hidden />
            {infoText}
          </div>,
          document.body
        )}
    </div>
  );
};
