import { css as dcss } from 'astroturf';
import React from 'react';

import JsDocBlock from './JsDocBlock';
import JsDocTitleSignature from './JsDocTitleSignature';
import LinkedHeading from './LinkedHeading';
import TsDocBlock from './TsDocBlock';
import TsDocTitleSignature from './TsDocTitleSignature';
import { TypedocNode } from './typedoc-types';
import jsDocTypeExpression from './utils/jsDocTypeExpression';
import tsDocTypeExpression, { getParams } from './utils/tsDocTypeExpression';

const styles = dcss`
  @component HookSignature {
    margin-left: theme(margin.-5);

    & > * {
      padding-left: theme(padding.5);
    }

    & .count {
      display: block;
      position: absolute;
      left: 0;

      &::before {
        content: 'ƒ';
      }
    }
  }

  .count {
    display: none;
  }
`;

function getTitle(jsDoc, tsDoc: TypedocNode) {
  if (jsDoc) {
    const params = jsDoc.params
      ? jsDoc.params.map((param) => {
          const type = param.type && `${param.optional ? '?' : ''}`;
          return `${param.name}${type || ''}`;
        })
      : [];

    const returns = jsDoc.returns?.length
      ? jsDocTypeExpression(jsDoc.returns[0].type)
      : 'void';

    return `ƒ (${params.join(', ')}) => ${returns}`;
  }
  // TODO: maybe?
  // const typeParams = tsDoc.typeParameter?.map(p => p.name);

  const params = getParams(tsDoc, { includeTypes: false });

  const returns = tsDoc.type ? tsDocTypeExpression(tsDoc.type) : 'void';

  return `ƒ (${params.join(', ')}) => ${returns}`;
}

function HookSignature({ jsDocType, tsDocType, level }: any) {
  const title = getTitle(jsDocType, tsDocType);

  return (
    <li className={styles.HookSignature}>
      <LinkedHeading
        id={title}
        title={title}
        h={level}
        css={dcss`position: relative;`}
      >
        <span className={styles.count} />
        {tsDocType && <TsDocTitleSignature definition={tsDocType} />}
        {jsDocType && <JsDocTitleSignature definition={jsDocType} />}
      </LinkedHeading>
      <div>
        {tsDocType && <TsDocBlock depth={level} definition={tsDocType} />}
        {jsDocType && <JsDocBlock depth={level} definition={jsDocType} />}
      </div>
    </li>
  );
}

export default HookSignature;
