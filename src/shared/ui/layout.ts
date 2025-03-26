import { UiComponent } from '../types/TYPES';

export interface LayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  sidebar?: React.ReactNode;
  isAuthenticated: boolean;
  onLogout: () => void;
}

export interface HeaderComponent extends UiComponent {
  props: {
    isAuthenticated: boolean;
    onLogout: () => void;
    user?: {
      id: string;
      username: string;
      role: string;
    };
  };
}

export interface FooterComponent extends UiComponent {
  props: {
    copyright: string;
    links: {
      text: string;
      href: string;
    }[];
  };
}

export interface SidebarComponent extends UiComponent {
  props: {
    isOpen: boolean;
    onClose: () => void;
    menuItems: {
      text: string;
      href: string;
      icon?: string;
    }[];
  };
} 