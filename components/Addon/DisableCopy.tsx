import { useConfigStore } from 'providers/configProvider';
import { useEffect } from 'react';

/**
 * 禁止用户拷贝文章的插件
 */
export default function DisableCopy() {
  const CAN_NOT_COPY = useConfigStore((state) => state.CAN_NOT_COPY);

  useEffect(() => {
    if (CAN_NOT_COPY) {
      // 全栈添加禁止复制的样式
      document.getElementsByTagName('html')[0].classList.add('forbid-copy');
      // 监听复制事件
      document.addEventListener('copy', function (event) {
        event.preventDefault(); // 阻止默认复制行为
        alert('抱歉，本网页内容不可复制！');
      });
    }
  }, []);

  return null;
}
