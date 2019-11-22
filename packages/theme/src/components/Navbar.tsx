import { css } from 'astroturf';
import cn from 'classnames';
import React from 'react';
import Box, { BoxProps } from './Box';

const styles = css`
  .navbar {
    composes: sticky from global;

    top: 0;
    height: theme('navbar.height');
    color: theme('navbar.color');
    background-color: theme('navbar.bg-color');
  }
`;

const Navbar = (props: BoxProps) => {
  return (
    <Box
      {...props}
      align="center"
      display="flex"
      px={{ sm: 3, md: 4 }}
      className={cn(props.className, styles.navbar)}
    />
  );
};

export default Navbar;
