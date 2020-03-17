import dstyled from 'astroturf';

const Anchor = dstyled('a')`
  @component Anchor & {
    text-decoration: underline;
  }
`;

export default Anchor;
