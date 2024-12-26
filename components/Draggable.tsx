import { useRef, useEffect } from 'react';

/**
 * 可拖拽组件
 */
export const Draggable = ({ children }: { children: React.ReactNode }) => {
  const draggableRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const isDragging = useRef(false);
  const currentObj = useRef<HTMLElement | null>(null);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const draggableElement = draggableRef.current;

    if (!draggableElement) return;

    const handleMouseDown = (event: MouseEvent | TouchEvent) => {
      const normalizedEvent = normalizeEvent(event);
      const child = draggableElement.firstElementChild as HTMLElement;

      if (inDragBox(normalizedEvent, child)) {
        currentObj.current = child;

        if (event.type === 'touchstart') {
          event.preventDefault();
          document.documentElement.style.overflow = 'hidden'; // 阻止页面滚动
        }

        isDragging.current = true;
        offset.current.x = normalizedEvent.clientX - child.offsetLeft;
        offset.current.y = normalizedEvent.clientY - child.offsetTop;

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('touchmove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchend', handleMouseUp);
      }
    };

    const handleMouseMove = (event: MouseEvent | TouchEvent) => {
      if (!isDragging.current || !currentObj.current) return;

      const normalizedEvent = normalizeEvent(event);

      rafRef.current = requestAnimationFrame(() => {
        const newLeft = normalizedEvent.clientX - offset.current.x;
        const newTop = normalizedEvent.clientY - offset.current.y;

        currentObj.current!.style.left = `${newLeft}px`;
        currentObj.current!.style.top = `${newTop}px`;

        checkInWindow(currentObj.current!);
      });
    };

    const handleMouseUp = () => {
      document.documentElement.style.overflow = 'auto'; // 恢复页面滚动

      isDragging.current = false;
      cancelAnimationFrame(rafRef.current!);

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleMouseUp);
    };

    const checkInWindow = (element: HTMLElement) => {
      const { offsetHeight, offsetWidth, offsetTop, offsetLeft } = element;
      const { clientWidth, clientHeight } = document.documentElement;

      if (offsetTop < 0) element.style.top = '0px';
      if (offsetTop > clientHeight - offsetHeight)
        element.style.top = `${clientHeight - offsetHeight}px`;

      if (offsetLeft < 0) element.style.left = '0px';
      if (offsetLeft > clientWidth - offsetWidth)
        element.style.left = `${clientWidth - offsetWidth}px`;
    };

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

    const inDragBox = (
      event: { clientX: number; clientY: number },
      element: HTMLElement,
    ) => {
      const { clientX, clientY } = event;
      const { offsetHeight, offsetWidth, offsetTop, offsetLeft } = element;

      const inHorizontal =
        clientX > offsetLeft && clientX < offsetLeft + offsetWidth;
      const inVertical =
        clientY > offsetTop && clientY < offsetTop + offsetHeight;

      return inHorizontal && inVertical;
    };

    draggableElement.addEventListener('mousedown', handleMouseDown);
    draggableElement.addEventListener('touchstart', handleMouseDown);

    return () => {
      draggableElement.removeEventListener('mousedown', handleMouseDown);
      draggableElement.removeEventListener('touchstart', handleMouseDown);

      cancelAnimationFrame(rafRef.current!);
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
