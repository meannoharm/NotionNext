import { useEffect, useRef } from 'react';
import VConsole from 'vconsole';

const VConsoleComponent = () => {
  const clickCountRef = useRef<number>(0); // 点击次数
  const lastClickTimeRef = useRef<number>(0); // 最近一次点击时间戳
  const timerRef = useRef<NodeJS.Timeout | null>(null); // 定时器引用
  const vConsole = useRef<VConsole | null>(null);


  useEffect(() => {
    const clickListener = (event: MouseEvent) => {
      const now = Date.now();
      // 只监听窗口中心的100x100像素范围内的单击事件
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const range = 50;
      const inRange =
        event.clientX >= centerX - range &&
        event.clientX <= centerX + range &&
        event.clientY >= centerY - range &&
        event.clientY <= centerY + range;

      if (!inRange) {
        return;
      }

      // 如果在1秒内连续点击了8次
      if (
        now - lastClickTimeRef.current < 1000 &&
        clickCountRef.current + 1 === 8
      ) {
        vConsole.current = new VConsole();
        clickCountRef.current = 0; // 重置计数器
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        window.removeEventListener('click', clickListener);
      } else {
        // 如果不满足条件，则重新设置时间戳和计数器
        lastClickTimeRef.current = now;
        clickCountRef.current += 1;
        // 如果计数器不为0，则设置定时器
        if (clickCountRef.current > 0) {
          if (timerRef.current) {
            clearTimeout(timerRef.current);
          }
          timerRef.current = setTimeout(() => {
            clickCountRef.current = 0;
          }, 1000);
        }
      }
    };

    // 监听窗口点击事件
    window.addEventListener('click', clickListener);
    return () => {
      window.removeEventListener('click', clickListener);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return null;
};

export default VConsoleComponent;
