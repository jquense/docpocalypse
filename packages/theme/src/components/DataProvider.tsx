import { graphql, useStaticQuery } from 'gatsby';
import React, { useContext, useMemo } from 'react';

const Context = React.createContext<any>(null);

export const usePageData = () => useContext(Context);

export const baseFragment = graphql`
  fragment DocpocalypseBase on Docpocalypse {
    type
    name
    packageName
    importName
    tags {
      name
      value
    }
  }
`;

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
          ...DocpocalypseBase
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
      api: data.api.nodes.map(({ name, ...rest }) => ({
        path: `/api/${name}`,
        title: name,
        ...rest,
      })),
    };
  }, [data]);

  return <Context.Provider value={context} {...props} />;
}

export default DataProvider;
