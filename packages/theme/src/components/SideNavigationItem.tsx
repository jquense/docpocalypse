import dstyled from 'astroturf';

const SideNavigationItem = dstyled('li')`
  @component SideNavigationItem & {
    & & {
      @apply pl-2
    }
  }
`;

export default SideNavigationItem;
