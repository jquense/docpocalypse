import styled from 'astroturf';

const ListItem = styled('li')`
  & a {
    display: block;
    padding: 0.125rem 1.5rem;
    color: var(--theme-link-color);

    &:hover {
      color: var(--theme-link-hover-color);
      text-decoration: none;
    }
  }
`;

export default ListItem;
