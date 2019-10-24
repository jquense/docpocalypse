import { css } from 'astroturf';
import { graphql, useStaticQuery } from 'gatsby';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import React, { useMemo } from 'react';
import Box from './Box';
import Link from './Link';

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
    [data.allDocpocalypse],
  );

  return (
    <Box
      {...props}
      css={css`
        position: sticky;
        top: var(--theme-navbar-height);
        height: calc(100vh - var(--theme-navbar-height));
        padding-top: 1.5rem;
        padding-bottom: 1.5rem;
        background-color: var(--theme-side-nav-bg-color);
        overflow-y: auto;
      `}
    >
      <nav>
        <ul>
          {Object.entries(groups).map(([pkg, nodes]) => (
            <li key={pkg}>
              {pkg}
              <ul>
                {nodes.map(n => (
                  <li key={n.name}>
                    <Link to={`/api/${n.name}`}>{n.name}</Link>
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
