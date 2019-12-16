import { css as dcss } from 'astroturf';
import React from 'react';

const Navbar = (props: React.HTMLProps<HTMLDivElement>) => {
  return (
    <div
      {...props}
      css={dcss`
        @apply sticky z-40 flex items-center px-4;

        top: 0;
        height: theme('navbar.height');
        color: theme('navbar.color');
        background-color: theme('navbar.bg-color');
    `}
    />
  );
};

export default Navbar;
