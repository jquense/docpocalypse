import { css as dcss } from 'astroturf';
import classNames from 'classnames';
import React from 'react';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface Props extends React.HTMLProps<HTMLHeadingElement> {
  level: HeadingLevel;
}

const styles = dcss`
  @component Heading {
    margin-top: theme('margin.6');
    margin-bottom: theme('margin.4');

    &.h1 {
      font-size: theme(fontSize.3xl);
    }
    &.h2 {
      font-size: theme(fontSize.2xl);
    }
    &.h3,
    &.h4 {
      font-size: theme(fontSize.xl);
    }
  }
`;

function Header({ level, ...props }: Props) {
  const Tag = `h${Math.min(level, 6)}` as React.ElementType;
  return (
    <Tag
      {...props}
      className={classNames(
        props.className,
        styles.Heading,
        styles[Tag as string]
      )}
    />
  );
}

export default Header;
