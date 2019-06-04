import React, { useEffect, useContext, ReactNode, Children } from 'react';
import classNames from 'classnames';
import { css, ClassNames } from '@emotion/core';

import { DocumentOutlineContext } from './DocumentOutlineProvider';

interface HProps {
  h: 1 | 2 | 3 | 4 | 5 | 6;
  id: string;
  title: ReactNode;
  className?: string;
  children?: ReactNode;
}

function Heading({ h, id, title, className, children }: HProps) {
  const { registerNode } = useContext(DocumentOutlineContext);

  useEffect(() => {
    if (!registerNode) return;

    return registerNode(h, title, id);
  }, [h, registerNode, title, id]);

  const H = `h${h}` as any;
  return (
    <ClassNames>
      {({ cx, css }) => (
        <H
          id={id}
          className={cx(
            className,
            '__heading',
            css`
              position: relative;
              pointer-events: none;

              &:before {
                display: block;
                height: 6rem;
                margin-top: -6rem;
                visibility: hidden;
                content: '';
              }
            `,
          )}
        >
          <div
            className={css`
              pointer-events: auto;
            `}
          >
            {children}
          </div>
        </H>
      )}
    </ClassNames>
  );
}

export default Heading;
