import dstyled from 'astroturf';
import Link from './Link';

const SideNavigationLink = dstyled(Link)`
  @component SideNavigationLink & {
    display: block;
    // padding-left: theme(padding.2);
    line-height: theme(lineHeight.relaxed);
    opacity: 0.8;

    &:hover,
    &:focus,
    &:active {
      opacity: 0.6;
    }
  }
`;

export default SideNavigationLink;
