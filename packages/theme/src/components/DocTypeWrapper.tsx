/* eslint-disable react/no-array-index-key */

import dstyled from 'astroturf';

const DocWrapper = dstyled('span')<{ block?: boolean }>`
  @component DocTypeWrapper & {
    @apply font-mono;

    font-size: initial;
    display: inline-block;

    &.block {
      display: block;
      margin-top: 20px;
    }
    &:before,
    &:after {
      color: #969584;
    }
    &:before {
      content: '{ ';
    }
    &:after {
      content: ' }';
    }
  }
`;

export default DocWrapper;
