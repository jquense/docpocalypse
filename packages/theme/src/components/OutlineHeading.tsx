import { css as dcss } from 'astroturf';
import React, { ReactNode, useContext, useEffect } from 'react';
import { DocumentOutlineContext } from './DocumentOutlineProvider';
import Heading from './Heading';

interface HProps {
  h: 1 | 2 | 3 | 4 | 5 | 6;
  id: string;
  title: ReactNode;
  className?: string;
  children?: ReactNode;
}

function OutlineHeading({ h, id, title, className, children }: HProps) {
  const { registerNode } = useContext(DocumentOutlineContext);

  useEffect(() => {
    if (!registerNode) return undefined;

    return registerNode(h, title, id);
  }, [h, registerNode, title, id]);

  return (
    <Heading
      id={id}
      level={h}
      css={dcss`
        position: relative;
        pointer-events: none;

        &:before {
          display: block;
          height: theme('navbar.height');
          margin-top: calc(theme('navbar.height') * -1);
          visibility: hidden;
          content: '';
        }
      `}
    >
      <div
        className={className}
        css={dcss`
          pointer-events: auto;
        `}
      >
        {children}
      </div>
    </Heading>
  );
}

export default OutlineHeading;
