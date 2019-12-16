import { css as dcss } from 'astroturf';
import { graphql, useStaticQuery } from 'gatsby';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import React, { useMemo } from 'react';
import { DocumentationNode } from '@docpocalypse/gatsby-theme-core';
import SideNavigationHeader from './SideNavigationHeader';
import SideNavigationLink from './SideNavigationLink';

const NAMES = {
  component: 'Components',
  hook: 'Hooks'
};

export interface Props {
  className?: string;
  groupComponentsBy?: string | ((docNode: DocumentationNode) => string);
}

function SideNav({ className, groupComponentsBy = d => NAMES[d.type] }: Props) {
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
    () =>
      groupBy(sortBy(data.allDocpocalypse.nodes, 'name'), groupComponentsBy),
    [data.allDocpocalypse, groupComponentsBy]
  );

  return (
    <div
      className={className}
      css={dcss`
        @apply p-4 sticky;

        top: theme('navbar.height');
        height: calc(100vh - theme('navbar.height'));
        background-color: theme('side-nav.bg-color');
        overflow-y: auto;
      `}
    >
      <nav>
        <ul>
          {Object.entries(groups).map(([groupName, nodes]) => (
            <li key={groupName}>
              <SideNavigationHeader>{groupName}</SideNavigationHeader>
              <ul css={dcss`@apply mb-4`}>
                {nodes.map(n => (
                  <li key={n.name}>
                    <SideNavigationLink to={`/api/${n.name}`}>
                      {n.name}
                    </SideNavigationLink>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default SideNav;
