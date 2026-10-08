import React from 'react';
import { NavLink } from 'react-router-dom';
import LogoSite from '../../../assets/svg/logo.svg?react';

type LogoProps = {
  className?: string;
};

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className={className}>
      <NavLink to='/' className='logo-link'>
        <LogoSite width={50} height={50} />
      </NavLink>
    </div>
  );
};

export default Logo;
