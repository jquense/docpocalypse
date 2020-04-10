import { Anchor } from '@docpocalypse/gatsby-theme';
import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';

interface Props extends React.ComponentPropsWithoutRef<'a'> {
  filePath: string;
}

const REPO = 'https://github.com/jquense/docpocalypse/tree/';

function SourceLink({ filePath, ...props }: Props) {
  const { gitCommit } = useStaticQuery(graphql`
    query {
      gitCommit(latest: { eq: true }) {
        hash
      }
    }
  `);

  return <Anchor href={`${REPO}${gitCommit.hash}/${filePath}`} {...props} />;
}

export default SourceLink;
