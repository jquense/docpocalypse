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
function OutlineHeading({ h, id, title, children, className }: HProps) {
  const { registerNode } = useContext(DocumentOutlineContext) ?? {};

  useEffect(() => {
    if (!registerNode) return undefined;

    return registerNode(+h, title, id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registerNode]);

  return (
    <Heading id={id} level={h} className={className}>
      {children}
    </Heading>
  );
}

export default OutlineHeading;
