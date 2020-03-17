import React, { useMemo, useContext } from 'react';
import { useStaticQuery, graphql } from 'gatsby';

const Context = React.createContext<any>(null);

export const usePageData = () => useContext(Context);

function DataProvider(props) {
  const data = useStaticQuery(graphql`
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

  const context = useMemo(() => {
    return {
      pages: data.allSitePage.nodes
        .filter(n => n.docpocalypse?.title)
        .map(d => ({
          path: d.path,
          title: d.docpocalypse.title,
        })),
      api: data.allDocpocalypse.nodes.map(n => ({
        path: `/api/${n.name}`,
        title: n.name,
      })),
    };
  }, [data]);

  return <Context.Provider value={context} {...props} />;
}

export default DataProvider;
