import dstyled from 'astroturf';
import Link from './Link';

const SideNavigationLink = dstyled(Link)`
  &,
  &:hover,
  &:focus,
  &:active {
    color: theme('body.color');
    text-decoration: none;
    opacity: 0.75;
  }

  &:hover,
  &:focus,
  &:active {
    opacity: 0.5;
  }
`;

export default SideNavigationLink;
