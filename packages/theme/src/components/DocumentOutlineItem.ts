import styled from '../styled';
import { transparentize } from 'polished';

const ListItem = styled('li')`
  & a {
    display: block;
    padding: 0.125rem 1.5rem;
    color: ${p => transparentize(0.4, p.theme.textColor)};

    &:hover {
      color: ${p => p.theme.color.primary};
      text-decoration: none;
    }
  }
`;

export default ListItem;
