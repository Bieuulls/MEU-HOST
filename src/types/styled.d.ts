import 'styled-components';
import { ThemeStyles } from './theme';

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeStyles {
    layout: ThemeStyles['layout'];
    colors: ThemeStyles['colors'];
    typography: ThemeStyles['typography'];
    spacing: any; // Add specific type if available
  }
}
