import React from 'react';
import "./Header.css"
import { Props } from '../../interface';

const Header: React.FC<Props> = ({children}) => {
  return (
    <div className="header"> 
      {children}
    </div>
  );
};

export default Header;
