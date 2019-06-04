import styled from '../styled';

const SidePanel = styled('div')`
  order: 2;
  position: sticky;
  top: 4rem;
  height: calc(100vh - 4rem);
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  font-size: 0.875rem;
  overflow-y: auto;

  & > ul {
    padding-left: 0;
    border-left: 1px solid ${p => p.theme.divider.color};

    & ul {
      padding-left: 1rem;
    }
  }
`;

export default SidePanel;
