import React from 'react'; 
import Header from './Header'; 
import type {ReactNode} from "react";

interface LayoutProps {
  children: ReactNode; 
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
