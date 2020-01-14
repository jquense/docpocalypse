import { css as dcss } from 'astroturf';
import cn from 'classnames';
import React from 'react';
import Anchor from './Anchor';
import { HeadingLevel } from './Heading';
import Heading from './OutlineHeading';

const styles = dcss`
  @component LinkedHeading {
    position: relative;
    pointer-events: none;

    .anchor {
      pointer-events: auto;
    }

    &:before {
      display: block;
      height: calc(theme('height.navbar') + theme('spacing.4'));
      margin-top: calc(theme('height.navbar') * -1 - theme('spacing.4') );
      visibility: hidden;
      content: '';
    }

}
`;

interface LinkHeadingProps {
  h: HeadingLevel;
  id: string;
  className?: string;
  children?: React.ReactNode;
}

function LinkedHeading({ h, id, className, children }: LinkHeadingProps) {
  return (
    <Heading
      h={h}
      id={id}
      title={children}
      className={cn(className, styles.LinkedHeading, '__heading')}
    >
      <Anchor target={id} className={styles.anchor}>
        {children}
      </Anchor>
    </Heading>
  );
}

export default LinkedHeading;
