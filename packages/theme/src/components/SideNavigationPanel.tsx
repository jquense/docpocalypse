import dstyled from 'astroturf';

const SideNavigationPanel = dstyled('div')`
  @component SideNavigationPanel & {
    @apply p-4;

    background-color: theme('colors.gray.100');
    overflow-y: auto;

    @screen md {
      @apply sticky;

      top: theme('height.navbar');
      height: calc(100vh - theme('height.navbar'));
    }
  }
`;

export default SideNavigationPanel;
