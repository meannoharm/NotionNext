import { DataBaseInfo } from '@/lib/notion/types';
import { PageMeta } from '@/pages/types';

export interface ThemeProps extends DataBaseInfo {
  meta: PageMeta;
  children: React.ReactNode;
}
