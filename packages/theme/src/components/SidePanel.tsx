import dstyled from 'astroturf';

const SidePanel = dstyled('div')`
  order: 2;
  position: sticky;
  height: calc(100vh - theme('navbar.height'));
  padding-top: 1.5rem;
  background-color: var(--theme-doc-outline-bg-color);
  padding-bottom: 1.5rem;
  font-size: 1.4rem;
  overflow-y: auto;

  & > ul {
    padding-left: 0;
    border-left: 1px solid $divider-color;

    & ul {
      padding-left: 1rem;
    }
  }
`;

export default SidePanel;
