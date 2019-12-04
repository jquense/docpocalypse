import dstyled, { css as dcss } from 'astroturf';
import { graphql, useStaticQuery } from 'gatsby';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import React, { useMemo } from 'react';
import Box from './Box';
import Link from './Link';

const NavHeader = dstyled('div')`
  @apply pb-3 font-bold capitalize;

  color: nav-header;
`;

const NavLink = dstyled(Link)`
  &,
  &:hover,
  &:focus,
  &:active {
    color: theme('body.color');
    text-decoration: none;
    opacity: 0.75;
  }

  &:hover,
  &:focus,
  &:active {
    opacity: 0.5;
  }
`;

const NAMES = {
  component: 'Components',
  hook: 'Hooks'
};

function SideNav(props) {
  const data = useStaticQuery(graphql`
    query SideNavQuery {
      allDocpocalypse {
        nodes {
          type
          name
          packageName
        }
      }
    }
  `);

  const groups = useMemo(
    () => groupBy(sortBy(data.allDocpocalypse.nodes, 'type'), 'type'),
    [data.allDocpocalypse]
  );

  return (
    <Box
      p={4}
      {...props}
      css={dcss`
        position: sticky;
        top: theme('navbar.height');
        height: calc(100vh - theme('navbar.height'));
        background-color: theme('side-nav.bg-color');
        // border-right: 1px solid theme('divider-color');
        overflow-y: auto;
      `}
    >
      <nav>
        <ul>
          {Object.entries(groups).map(([pkg, nodes]) => (
            <li key={pkg}>
              <NavHeader>{NAMES[pkg]}</NavHeader>
              <ul className="mb-4">
                {nodes.map(n => (
                  <li key={n.name}>
                    <NavLink to={`/api/${n.name}`}>{n.name}</NavLink>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
    </Box>
  );
}

export default SideNav;
