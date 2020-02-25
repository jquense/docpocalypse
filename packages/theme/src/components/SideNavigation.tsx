import { css as dcss } from 'astroturf';
import { graphql, useStaticQuery } from 'gatsby';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import React, { useMemo } from 'react';
import { DocumentationNode } from '@docpocalypse/gatsby-theme-core';
import SideNavigationHeader from './SideNavigationHeader';
import SideNavigationLink from './SideNavigationLink';
import SideNavigationPanel from './SideNavigationPanel';

const NAMES = {
  component: 'Components',
  hook: 'Hooks'
};

type GroupBy = (node: DocumentationNode) => string;

export interface Props {
  className?: string;

  /** @defaultValue "type" */
  groupComponentsBy?: string | GroupBy;
}

/** @public */
function SideNavigation({ className, groupComponentsBy = () => 'API' }: Props) {
  const data = useStaticQuery(graphql`
    query {
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
    <SideNavigationPanel className={className}>
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
    </SideNavigationPanel>
  );
}

SideNavigation.Panel = SideNavigationPanel;
SideNavigation.Header = SideNavigationHeader;
SideNavigation.Link = SideNavigationLink;

export default SideNavigation;
