import { DocumentationNode } from '@docpocalypse/gatsby-theme-core';
import { css as dcss } from 'astroturf';
import sortBy from 'lodash/sortBy';
import React from 'react';

import { usePageData } from './DataProvider';
import SideNavigationHeader from './SideNavigationHeader';
import SideNavigationItem from './SideNavigationItem';
import SideNavigationLink from './SideNavigationLink';
import SideNavigationPanel from './SideNavigationPanel';

type GroupBy = (node: DocumentationNode) => string;

export { usePageData };

export interface Props {
  className?: string;

  /** @defaultValue "type" */
  groupComponentsBy?: string | GroupBy;
}

/** @public */
function SideNavigation({ className }: Props) {
  const { pages, api } = usePageData();

  return (
    <SideNavigationPanel className={className}>
      <nav>
        <ul>
          {pages.map(page => (
            <SideNavigationItem key={page.path}>
              <SideNavigationLink to={page.path}>
                {page.title}
              </SideNavigationLink>
            </SideNavigationItem>
          ))}
          <SideNavigationItem>
            <SideNavigationHeader>API</SideNavigationHeader>
            <ul css={dcss`@apply mb-4`}>
              {sortBy(api, 'title').map(page => (
                <SideNavigationItem key={page.title}>
                  <SideNavigationLink to={page.path}>
                    {page.title}
                  </SideNavigationLink>
                </SideNavigationItem>
              ))}
            </ul>
          </SideNavigationItem>
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
