import { useTheme } from '../../../contexts/ThemeContext';
import { DefaultMenu } from './DefaultMenu';
import { CenteredMenu } from './CenteredMenu';
import { MinimalMenu } from './MinimalMenu';
import { FullwidthMenu } from './FullwidthMenu';
import { SidebarMenu } from './SidebarMenu';

interface MenuProps {
  cartCount: number;
  onSearch: (query: string) => void;
}

export function Menu({ cartCount, onSearch }: MenuProps) {
  const { currentTheme } = useTheme();
  const { menu } = currentTheme;

  const menuComponents = {
    default: DefaultMenu,
    centered: CenteredMenu,
    minimal: MinimalMenu,
    fullwidth: FullwidthMenu,
    sidebar: SidebarMenu
  };

  const MenuComponent = menuComponents[menu.type];

  return <MenuComponent cartCount={cartCount} onSearch={onSearch} />;
}
