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

/** @public */
function OutlineHeading({ h, id, title, children }: HProps) {
  const { registerNode } = useContext(DocumentOutlineContext) ?? {};

  useEffect(() => {
    if (!registerNode) return undefined;

    return registerNode(h, title, id);
  }, [h, registerNode, title, id]);

  return (
    <Heading id={id} level={h}>
      {children}
    </Heading>
  );
}

export default OutlineHeading;
