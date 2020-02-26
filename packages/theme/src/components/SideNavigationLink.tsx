import dstyled from 'astroturf';
import Link from './Link';

const SideNavigationLink = dstyled(Link)`
  @component SideNavigationLink & {
    @apply py-px;

    display: block;
    line-height: theme(lineHeight.relaxed);
    // opacity: 0.8;

    &:hover,
    &:focus,
    &:active {
      opacity: 0.7;
    }
  }
`;

export default SideNavigationLink;
