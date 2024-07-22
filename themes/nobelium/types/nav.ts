export type NavLink = {
  id?: number;
  icon?: string;
  name: string;
  to: string;
  show: boolean;
  target?: string;
  subMenus?: NavLink[];
  title?: '';
};
