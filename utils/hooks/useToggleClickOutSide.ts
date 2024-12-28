import { useEffect } from 'react';
import type { RefObject } from 'react';

export default function useToggleClickOutSide(
  targetRef: RefObject<HTMLElement> | RefObject<HTMLElement>[],
  callback: (...arg: any) => any,
) {
  useEffect(() => {
    let targetRefs: RefObject<HTMLElement>[] = [];
    if (!Array.isArray(targetRef)) {
      targetRefs = [targetRef];
    } else {
      targetRefs = targetRef;
    }
    const handleClickOutside = (event: MouseEvent) => {
      let isOutside = true;
      targetRefs.forEach((ref) => {
        if (ref.current && ref.current.contains(event.target as Node)) {
          isOutside = false;
        }
      });
      if (isOutside) {
        callback();
      }
    };

    document.addEventListener('mouseup', handleClickOutside);
    return () => {
      document.removeEventListener('mouseup', handleClickOutside);
    };
  }, [callback, targetRef]);
}
