import classNames from 'classnames';
import React from 'react';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface Props extends React.HTMLProps<HTMLHeadingElement> {
  level: HeadingLevel;
}

function Header({ level, ...props }: Props) {
  const Tag = `h${Math.min(level, 6)}` as React.ElementType;
  return <Tag {...props} className={classNames(props.className)} />;
}

export default Header;
