import { css as dcss } from 'astroturf';
import cn from 'classnames';
import React from 'react';
import Anchor from './Anchor';
import Heading from './OutlineHeading';

const styles = dcss`
  @component LinkedHeading {
    position: relative;

    &:before {
      display: block;
      pointer-events: none;
      height: calc(theme('height.navbar') + theme('spacing.4'));
      margin-top: calc(theme('height.navbar') * -1 - theme('spacing.4') );
      visibility: hidden;
      content: '';
    }
}
`;

function LinkedHeading({ h, id, className, children }) {
  return (
    <Heading
      h={h}
      id={id}
      title={children}
      className={cn(className, styles.LinkedHeading, '__heading')}
    >
      <Anchor target={id}>{children}</Anchor>
    </Heading>
  );
}

export default LinkedHeading;
