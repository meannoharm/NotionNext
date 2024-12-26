import React, { useRef, useEffect, useImperativeHandle, useCallback } from 'react';
import type { FC, ForwardedRef, ReactNode } from 'react';


const getInitialStyle = (type: 'horizontal' | 'vertical') => ({
  [type === 'vertical' ? 'height' : 'width']: '0px',
  willChange: type === 'vertical' ? 'height' : 'width',
});

export interface CollapseHandle {
  updateCollapseSize: () => void;
}

export interface CollapseProps {
  type?: 'horizontal' | 'vertical';
  isOpen: boolean;
  className?: string;
  duration?: number;
  onSizeChange?: (param: {
    height: number;
    width: number;
    increase: boolean;
  }) => void;
  collapseRef?: ForwardedRef<CollapseHandle>;
  children: ReactNode;
}

const Collapse: FC<CollapseProps> = ({
  collapseRef,
  type = 'vertical',
  onSizeChange,
  isOpen = false,
  className,
  duration = 200,
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const updateSize = useCallback((element: HTMLDivElement, targetSize: string) => {
    const property = type === 'vertical' ? 'height' : 'width';
    const scrollSize = type === 'vertical' ? element.scrollHeight : element.scrollWidth;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    requestAnimationFrame(() => {
      element.style[property] = `${scrollSize}px`;
      
      if (targetSize === 'auto') {
        timeoutRef.current = setTimeout(() => {
          element.style[property] = targetSize;
        }, duration);
      } else {
        requestAnimationFrame(() => {
          element.style[property] = targetSize;
        });
      }
    });
  }, [type]);

  useImperativeHandle(collapseRef, () => ({
    updateCollapseSize: () => {
      if (ref.current) {
        updateSize(ref.current, isOpen ? 'auto' : '0px');
      }
    }
  }));

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (isOpen) {
      updateSize(element, 'auto');
    } else {
      updateSize(element, '0px');
    }

    onSizeChange?.({
      height: element.scrollHeight || 0,
      width: element.scrollWidth || 0,
      increase: isOpen,
    });
  }, [isOpen, updateSize, onSizeChange]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      style={getInitialStyle(type)}
      className={`${className || ''} overflow-hidden transition-all duration-${duration}`}
    >
      {children}
    </div>
  );
};

export default Collapse;
