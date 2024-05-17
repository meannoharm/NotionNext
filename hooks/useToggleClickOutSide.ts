import { useEffect } from 'react';

export default function useToggleClickOutSide(
  targetRef: any,
  callback: Function,
) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (targetRef.current && !targetRef.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [callback, targetRef]);
}
