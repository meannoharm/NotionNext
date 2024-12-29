import { useRef, useEffect } from 'react';

/**
 * 可拖拽组件
 */
export const Draggable = ({ children }: { children: React.ReactNode }) => {
  const draggableRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const currentObj = useRef<HTMLElement | null>(null);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const draggableElement = draggableRef.current;

    if (!draggableElement) return;

    const handleMouseDown = (event: MouseEvent | TouchEvent) => {
      const normalizedEvent = normalizeEvent(event);
      const child = draggableElement.firstElementChild as HTMLElement;

      if (isInsideDragArea(normalizedEvent, child)) {
        currentObj.current = child;
        isDragging.current = true;

        offset.current = {
          x: normalizedEvent.clientX - child.offsetLeft,
          y: normalizedEvent.clientY - child.offsetTop,
        };

        if (event.type === 'touchstart') {
          event.preventDefault();
          document.documentElement.style.overflow = 'hidden';
        }

        addEventListeners();
      }
    };

    const handleMouseMove = (event: MouseEvent | TouchEvent) => {
      if (!isDragging.current || !currentObj.current) return;

      const normalizedEvent = normalizeEvent(event);
      const newLeft = normalizedEvent.clientX - offset.current.x;
      const newTop = normalizedEvent.clientY - offset.current.y;

      moveElementWithinBounds(currentObj.current, newLeft, newTop);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      currentObj.current = null;
      document.documentElement.style.removeProperty('overflow');

      removeEventListeners();
    };

    const addEventListeners = () => {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('touchmove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchend', handleMouseUp);
    };

    const removeEventListeners = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleMouseUp);
    };

    draggableElement.addEventListener('mousedown', handleMouseDown);
    draggableElement.addEventListener('touchstart', handleMouseDown);

    return () => {
      draggableElement.removeEventListener('mousedown', handleMouseDown);
      draggableElement.removeEventListener('touchstart', handleMouseDown);
      removeEventListeners();
    };
  }, []);

  return (
    <div
      ref={draggableRef}
      className="draggable cursor-grab select-none"
      style={{ position: 'absolute' }}
    >
      {children}
    </div>
  );
};

/**
 * 检查事件是否在可拖拽元素内部
 */
const isInsideDragArea = (
  event: { clientX: number; clientY: number },
  element: HTMLElement,
) => {
  const { clientX, clientY } = event;
  const { offsetHeight, offsetWidth, offsetTop, offsetLeft } = element;

  return (
    clientX >= offsetLeft &&
    clientX <= offsetLeft + offsetWidth &&
    clientY >= offsetTop &&
    clientY <= offsetTop + offsetHeight
  );
};

/**
 * 确保元素在窗口范围内移动
 */
const moveElementWithinBounds = (
  element: HTMLElement,
  newLeft: number,
  newTop: number,
) => {
  const { offsetHeight, offsetWidth } = element;
  const { clientWidth, clientHeight } = document.documentElement;

  const clampedLeft = Math.max(0, Math.min(clientWidth - offsetWidth, newLeft));
  const clampedTop = Math.max(0, Math.min(clientHeight - offsetHeight, newTop));

  element.style.left = `${clampedLeft}px`;
  element.style.top = `${clampedTop}px`;
};

/**
 * 规范化事件对象（支持鼠标事件和触摸事件）
 */
const normalizeEvent = (event: MouseEvent | TouchEvent) => {
  if ('touches' in event) {
    return {
      clientX: event.touches[0].clientX,
      clientY: event.touches[0].clientY,
    };
  }
  return {
    clientX: event.clientX,
    clientY: event.clientY,
  };
};
