import { css as dcss } from 'astroturf';
import { graphql, useStaticQuery } from 'gatsby';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import React, { useMemo } from 'react';
import { DocumentationNode } from '@docpocalypse/gatsby-theme-core';
import SideNavigationHeader from './SideNavigationHeader';
import SideNavigationLink from './SideNavigationLink';
import SideNavigationPanel from './SideNavigationPanel';
import SideNavigationItem from './SideNavigationItem';

type GroupBy = (node: DocumentationNode) => string;

export interface Props {
  className?: string;

  /** @defaultValue "type" */
  groupComponentsBy?: string | GroupBy;
}

/** @public */
function SideNavigation({ className, groupComponentsBy = () => 'API' }: Props) {
  const { allDocpocalypse, allSitePage } = useStaticQuery(graphql`
    query {
      allSitePage(
        filter: {
          pluginCreator: { name: { ne: "@docpocalypse/gatsby-theme-core" } }
        }
      ) {
        nodes {
          path
          docpocalypse {
            title
          }
          pluginCreator {
            name
          }
        }
      }
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
    () => groupBy(sortBy(allDocpocalypse.nodes, 'name'), groupComponentsBy),
    [allDocpocalypse, groupComponentsBy],
  );

  return (
    <SideNavigationPanel className={className}>
      <nav>
        <ul>
          {allSitePage.nodes
            .filter(n => n.docpocalypse?.title)
            .map(page => (
              <SideNavigationItem key={page.path}>
                <SideNavigationLink to={page.path}>
                  {page.docpocalypse.title}
                </SideNavigationLink>
              </SideNavigationItem>
            ))}
          {Object.entries(groups).map(([groupName, nodes]) => (
            <SideNavigationItem key={groupName}>
              <SideNavigationHeader>{groupName}</SideNavigationHeader>
              <ul css={dcss`@apply mb-4`}>
                {nodes.map(n => (
                  <SideNavigationItem key={n.name}>
                    <SideNavigationLink to={`/api/${n.name}`}>
                      {n.name}
                    </SideNavigationLink>
                  </SideNavigationItem>
                ))}
              </ul>
            </SideNavigationItem>
          ))}
        </ul>
      </nav>
    </SideNavigationPanel>
  );
}

SideNavigation.Panel = SideNavigationPanel;
SideNavigation.Header = SideNavigationHeader;
SideNavigation.Link = SideNavigationLink;
SideNavigation.Item = SideNavigationItem;

export default SideNavigation;
