import { css } from 'astroturf';
import cn from 'classnames';
import React from 'react';
import Box, { BoxProps } from './Box';

const styles = css`
  .navbar {
    color: var(--theme-navbar-color);
    background-color: var(--theme-navbar-bg-color);
    height: var(--theme-navbar-height);

    --theme-link-color: var(--theme-navbar-link-color);
    --theme-link-hover-color: var(--theme-navbar-link-hover-color);
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
