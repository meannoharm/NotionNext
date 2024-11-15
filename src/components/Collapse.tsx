import React, { useRef, useEffect, useImperativeHandle } from 'react';
import type { FC, ForwardedRef, ReactNode } from 'react';

const VerticalStyle = { height: '0px', willChange: 'height' };
const horizontalStyle = { width: '0px', willChange: 'width' };

export interface CollapseHandle {
  updateCollapseHeight: () => void;
}

export interface CollapseProps {
  type?: 'horizontal' | 'vertical';
  isOpen: boolean;
  className?: string;
  onHeightChange?: (param: {
    height: number;
    width: number;
    increase: boolean;
  }) => void;
  collapseRef?: ForwardedRef<CollapseHandle>;
  children: ReactNode;
}

/**
 * 折叠面板组件，支持水平折叠、垂直折叠
 * @param {type:['horizontal','vertical'],isOpen} props
 * @returns
 */
const Collapse: FC<CollapseProps> = (props) => {
  const {
    collapseRef,
    type = 'vertical',
    onHeightChange,
    isOpen = false,
    className,
    children,
  } = props;
  const ref = useRef<HTMLDivElement>(null);

  useImperativeHandle(collapseRef, () => {
    return {
      /**
       * 当子元素高度变化时，可调用此方法更新折叠组件的高度
       * @param {*} param0
       */
      updateCollapseHeight: () => {
        const style = ref.current?.style;
        if (style) {
          style.height = 'auto';
          style.width = 'auto';
        }
        // ref.current.style.height = ref.current.scrollHeight;
        // ref.current.style.height = 'auto';
      },
    };
  });

  /**
   * 折叠
   * @param {*} element
   */
  const collapseSection = (element: HTMLDivElement) => {
    const sectionHeight = element.scrollHeight;
    const sectionWidth = element.scrollWidth;

    requestAnimationFrame(function () {
      switch (type) {
        case 'horizontal':
          element.style.width = sectionWidth + 'px';
          requestAnimationFrame(function () {
            element.style.width = 0 + 'px';
          });
          break;
        case 'vertical':
          element.style.height = sectionHeight + 'px';
          requestAnimationFrame(function () {
            element.style.height = 0 + 'px';
          });
      }
    });
  };

  /**
   * 展开
   * @param {*} element
   */
  const expandSection = (element: HTMLDivElement) => {
    const sectionHeight = element.scrollHeight;
    const sectionWidth = element.scrollWidth;
    let clearTime: NodeJS.Timeout;
    switch (type) {
      case 'horizontal':
        element.style.width = sectionWidth + 'px';
        clearTime = setTimeout(() => {
          element.style.width = 'auto';
        }, 400);
        break;
      case 'vertical':
        element.style.height = sectionHeight + 'px';
        clearTime = setTimeout(() => {
          element.style.height = 'auto';
        }, 400);
    }

    clearTimeout(clearTime);
  };

  useEffect(() => {
    if (isOpen) {
      if (ref.current) expandSection(ref.current);
    } else {
      if (ref.current) collapseSection(ref.current);
    }
    // 通知父组件高度变化
    onHeightChange &&
      onHeightChange({
        height: ref.current?.scrollHeight || 0,
        width: ref.current?.scrollWidth || 0,
        increase: isOpen,
      });
  }, [isOpen]);

  return (
    <div
      ref={ref}
      style={type === 'vertical' ? VerticalStyle : horizontalStyle}
      className={`${className || ''} overflow-hidden duration-200 `}
    >
      {children}
    </div>
  );
};

export default Collapse;
