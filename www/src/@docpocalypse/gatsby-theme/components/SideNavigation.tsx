import { graphql, useStaticQuery } from 'gatsby';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import React, { useMemo } from 'react';
import SideNavigation from '@docpocalypse/gatsby-theme/src/components/SideNavigation';

function AppSideNavigation(props) {
  const { allDocpocalypse } = useStaticQuery(graphql`
    fragment SideNav_docs on Docpocalypse {
      type
      name
      packageName
      tags {
        name
      }
    }

    query {
      allDocpocalypse(
        filter: { tags: { elemMatch: { name: { eq: "public" } } } }
      ) {
        nodes {
          ...SideNav_docs
        }
      }
    }
  `);

  const groups = useMemo(
    () =>
      groupBy(sortBy(allDocpocalypse.nodes, 'name'), d =>
        d.packageName.replace(/@.+\//, ''),
      ),
    [allDocpocalypse],
  );
  const { 'gatsby-theme': main, ...rest } = groups;

  return (
    <SideNavigation.Panel {...props}>
      <nav>
        <ul>
          <SideNavigation.Item className="mb-4">
            <SideNavigation.Link to="/getting-started">
              Getting Started
            </SideNavigation.Link>
            <SideNavigation.Link to="/writing-docs">
              Writing Documentation
            </SideNavigation.Link>
            <SideNavigation.Link to="/theming">Theming</SideNavigation.Link>
          </SideNavigation.Item>
          <SideNavigation.Item>
            <SideNavigation.Header>Theme Components</SideNavigation.Header>
            <ul className="mb-4">
              {main.map(n => (
                <SideNavigation.Item key={n.name}>
                  <SideNavigation.Link to={`/api/${n.name}`}>
                    {n.name}
                  </SideNavigation.Link>
                </SideNavigation.Item>
              ))}
            </ul>
          </SideNavigation.Item>
          <SideNavigation.Item>
            <SideNavigation.Header>Ecosystem Packages</SideNavigation.Header>
            <ul>
              {Object.entries(rest).map(([groupName, nodes]) => (
                <SideNavigation.Item key={groupName}>
                  <SideNavigation.Header>{groupName}</SideNavigation.Header>
                  <ul className="mb-4">
                    {nodes.map(n => (
                      <SideNavigation.Item key={n.name}>
                        <SideNavigation.Link to={`/api/${n.name}`}>
                          {n.name}
                        </SideNavigation.Link>
                      </SideNavigation.Item>
                    ))}
                  </ul>
                </SideNavigation.Item>
              ))}
            </ul>
          </SideNavigation.Item>
        </ul>
      </nav>
    </SideNavigation.Panel>
  );
}

export default AppSideNavigation;
