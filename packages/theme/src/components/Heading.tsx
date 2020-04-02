import { css as dcss } from 'astroturf';
import classNames from 'classnames';
import React from 'react';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface Props extends React.HTMLProps<HTMLHeadingElement> {
  level?: HeadingLevel;
}

const styles = dcss`
  @component Heading {

    margin-top: theme('margin.8');

    &.h1 {
      font-size: theme(fontSize.3xl);
      margin-bottom: theme('margin.4');
    }
    &.h2 {
      font-size: theme(fontSize.2xl);
      margin-bottom: theme('margin.4');
    }
    &.h3,
    &.h4 {
      font-size: theme(fontSize.xl);
      margin-bottom: theme('margin.4');
    }
  }
`;

function Header({ level, ...props }: Props) {
  const Tag = (level == null || level > 6
    ? 'header'
    : `h${Math.min(level, 6)}`) as React.ElementType;
  return (
    <Tag
      {...props}
      className={classNames(
        props.className,
        styles.Heading,
        styles[Tag as string],
      )}
    />
  );
}

export default Header;
