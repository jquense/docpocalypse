import React, { ReactType, ReactNode } from 'react';
import cn from 'classnames';
import styled from '../styled';

const Wrapper = styled('span')`
  position: relative;
  display: inline-block;
  padding-right: 1em;
`;

const A = styled('a')`
  font-size: 90%;
  position: absolute;
  right: 0.3em;
  padding-top: 0.1em;
  opacity: 0;

  &:focus,
  .__heading:hover & {
    text-decoration: none;
    opacity: 0.5;
  }
`;

interface Props {
  as?: ReactType;
  target: string;
  children?: ReactNode;
  className?: string;
}

function Anchor({ as: asProp, target, children, className }: Props) {
  return (
    // @ts-ignore
    <Wrapper as={asProp} className={className}>
      {children}
      <A href={`#${target}`} aria-hidden>
        <span aria-hidden>#</span>
      </A>
    </Wrapper>
  );
}

export default Anchor;
