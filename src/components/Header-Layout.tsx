// Layout.tsx
import React from 'react'; // Import ReactNode for children typing
import Header from './Header'; // Import your Header component
import type {ReactNode} from "react";

interface LayoutProps {
  children: ReactNode; // Explicitly define the 'children' prop type
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <Header />  
      <main>{children}</main> 
    </div>
  );
};

export default Layout;
