import styled, { css } from 'astroturf';
import { graphql, useStaticQuery } from 'gatsby';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import React, { useMemo } from 'react';
import Box from './Box';
import Link from './Link';

const NavList = styled('ul')`
  margin: 0;
  padding: 0;
`;

const NavItem = styled('li')`
  list-style: none;
  padding: 0;
`;

const NavLink = styled(Link)`
  &,
  &:hover,
  &:focus,
  &:active {
    color: text-color;
    text-decoration: none;
    opacity: 0.75;
  }

  &:hover,
  &:focus,
  &:active {
    opacity: 0.5;
  }
`;

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
    () => groupBy(sortBy(data.allDocpocalypse.nodes, 'type'), 'packageName'),
    [data.allDocpocalypse]
  );

  return (
    <Box
      p={4}
      {...props}
      css={css`
        position: sticky;
        // top: $navbar-height;
        // height: calc(100vh - #{$navbar-height});
        // background-color: $side-nav-bg-color;
        // border: 1px solid $divider-color;
        // overflow-y: auto;
      `}
    >
      <nav>
        <NavList>
          {Object.entries(groups).map(([pkg, nodes]) => (
            <NavItem key={pkg}>
              <div className="pb-3 font-weight-boold">{pkg}</div>
              <NavList>
                {nodes.map(n => (
                  <NavItem key={n.name}>
                    <NavLink to={`/api/${n.name}`}>{n.name}</NavLink>
                  </NavItem>
                ))}
              </NavList>
            </NavItem>
          ))}
        </NavList>
      </nav>
    </Box>
  );
}

export default SideNav;
