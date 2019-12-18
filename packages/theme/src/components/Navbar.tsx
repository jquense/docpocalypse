import { css as dcss } from 'astroturf';
import React from 'react';

/** @public */
const Navbar = (props: React.HTMLProps<HTMLDivElement>) => {
  return (
    <div
      {...props}
      css={dcss`
        @component Navbar & {
          @apply sticky z-40 top-0 flex items-center px-4 text-white bg-primary;

          height: theme('height.navbar');
        }
    `}
    />
  );
};

export default Navbar;
