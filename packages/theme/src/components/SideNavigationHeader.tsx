import dstyled from 'astroturf';

const SideNavigationHeader = dstyled('div')`
  @component SideNavigationHeader & {
    display: block;
    font-weight: theme('fontWeight.medium');
    padding: theme(padding.3) 0 theme(padding.2);
  }
`;

export default SideNavigationHeader;
