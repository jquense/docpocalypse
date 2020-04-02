import React from 'react';
import dstyled, { css as dcss } from 'astroturf';

import LinkedHeading from './LinkedHeading';
import typeExpression from './utils/jsDocTypeExpression';
import JsDocTitleSignature from './JsDocTitleSignature';
import JsDocBlock from './JsDocBlock';

const HookSignatureCount = dstyled('span')`
  position: absolute;
  left: 0;

  &::before {
    content: 'ƒ';
  }
`;

function HookSignature({ definition, level }) {
  const params = definition.params
    ? definition.params.map(param => {
        const type = param.type && `${param.optional ? '?' : ''}`;
        return `${param.name}${type || ''}`;
      })
    : [];

  const returns = definition.returns?.length
    ? typeExpression(definition.returns[0].type)
    : 'void';

  const title = `ƒ (${params.join(', ')}) => ${returns}`;

  return (
    <li
      css={dcss`
      @component HookSignature & {
        margin-left: theme(margin.-5);

        & > * {
          padding-left: theme(padding.5);
        }
      }
   `}
    >
      <LinkedHeading
        id={title}
        title={title}
        h={level}
        css={dcss`position: relative;`}
      >
        <HookSignatureCount />
        <JsDocTitleSignature definition={definition} />
      </LinkedHeading>
      <div>
        <JsDocBlock depth={level} definition={definition} />
      </div>
    </li>
  );
}

export default HookSignature;
