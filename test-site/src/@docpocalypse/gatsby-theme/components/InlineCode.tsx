import styled from 'astroturf';
import InlineCode from '@docpocalypse/gatsby-theme/src/components/InlineCode';

export default styled(InlineCode)`
  composes: text-accent leading-tight px-1 py-1 bg-subtle rounded-sm from global;
`;
