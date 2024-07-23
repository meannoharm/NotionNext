export type NavLink = {
  id?: string;
  icon?: string;
  name: string;
  to: string;
  show: boolean;
  target?: string;
  subMenus?: NavLink[];
  title?: '';
};
