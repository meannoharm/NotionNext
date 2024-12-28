import { type ReactNode } from 'react';
import ExternalPlugins from 'components/ExternalPlugins';
import useProgress from '@/utils/hooks/useProgress';
import useDarkMode from '@/utils/hooks/useDarkMode';

export default function Layout({ children }: { children: ReactNode }) {
  useProgress();
  useDarkMode();

  return (
    <>
      <ExternalPlugins />
      {children}
    </>
  );
}
