import React, { useMemo, useContext } from 'react';
import { useStaticQuery, graphql } from 'gatsby';

const Context = React.createContext<any>(null);

export const usePageData = () => useContext(Context);

export const pagesFragment = graphql`
  fragment DocpocalypsePageQuery on Query {
    pages: allSitePage(
      filter: {
        pluginCreator: { name: { ne: "@docpocalypse/gatsby-theme-core" } }
      }
    ) {
      nodes {
        path
        docpocalypse {
          title
        }
      }
    }
  }
`;

function DataProvider(props) {
  const data = useStaticQuery(graphql`
    query {
      ...DocpocalypsePageQuery
      api: allDocpocalypse {
        nodes {
          type
          name
          packageName
          tags {
            name
            value
          }
        }
      }
    }
  `);

  const context = useMemo(() => {
    return {
      pages: data.pages.nodes
        .filter(n => n.docpocalypse?.title)
        .map(d => ({
          path: d.path,
          title: d.docpocalypse.title,
        })),
      api: data.api.nodes.map(n => ({
        path: `/api/${n.name}`,
        title: n.name,
        tags: n.tags,
      })),
    };
  }, [data]);

  return <Context.Provider value={context} {...props} />;
}

export default DataProvider;
