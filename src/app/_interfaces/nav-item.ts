export interface NavItem {
  path?: string;
  id: string;
  label: string;
  icon?: string;
  links?: NavItem[];
  action?: () => void;
  showLabel?: boolean;
  showIcon?: boolean;
  disabled?: boolean;
}
