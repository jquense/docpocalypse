import styled from 'astroturf';

const SidePanel = styled('div')`
  order: 2;
  position: sticky;
  top: var(--theme-navbar-height);
  height: calc(100vh - var(--theme-navbar-height));
  padding-top: 1.5rem;
  background-color: var(--theme-doc-outline-bg-color);
  padding-bottom: 1.5rem;
  font-size: 1.4rem;
  overflow-y: auto;

  & > ul {
    padding-left: 0;
    border-left: 1px solid var(--theme-color-divider);

    & ul {
      padding-left: 1rem;
    }
  }
`;

export default SidePanel;
