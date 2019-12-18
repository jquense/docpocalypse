import dstyled from 'astroturf';

/** @public */
const SidePanel = dstyled('div')`
  @apply sticky text-sm py-3;

  top: theme('height.navbar');
  height: calc(100vh - theme('height.navbar'));
  overflow-y: auto;

  & > ul {
    padding-left: 0;
    border-left: 1px solid them('divider.color');

    & ul {
      padding-left: 1rem;
    }
  }
`;

export default SidePanel;
