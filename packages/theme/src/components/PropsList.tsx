import renderProps from '@docpocalypse/props-table';
import { TokenMap } from '@docpocalypse/props-table/src/TypescriptTypeValue';
import { MDXProvider } from '@mdx-js/react';
import { css as dcss } from 'astroturf';
import React, { useMemo } from 'react';

import LinkedHeading from './LinkedHeading';
import Pre from './Pre';
import PropDescription from './PropDescription';

const tokenMap: TokenMap = dcss`
  .union {
    & > *:not(:last-child)::after {
      content: ' | ';
    }
  }
`;

const styles = dcss`
  @component PropListName {
  }

  @component PropListRequiredBadge {
    @apply rounded bg-subtle text-accent text-xs font-default ml-2 px-2;
  }

  @component PropListTypeDefinition {
    @apply ml-1 font-mono text-accent;
  }

  @component PropListDefaultValue {
    @apply ml-1 text-accent font-mono;
  }
`;

function PropsTable({ metadata }) {
  const { name } = metadata;
  const props = renderProps(metadata.props || [], { tokenMap });
  const components = useMemo(
    () => ({
      pre: p => <Pre {...p} name={name} />,
    }),
    [name],
  );

  return (
    <>
      {props.map(prop => (
        <React.Fragment key={prop.name}>
          <LinkedHeading h={3} id={prop.name}>
            <div
              css={dcss`
                @apply inline-flex items-center;
              `}
            >
              <span className={styles.PropListName}>{prop.name}</span>
              {prop.propData.required && (
                <strong className={styles.PropListRequiredBadge}>
                  required
                </strong>
              )}
            </div>
          </LinkedHeading>

          <MDXProvider components={components}>
            <PropDescription
              mdx={prop.propData.description?.mdx}
              html={prop.description}
            />
          </MDXProvider>
          <div
            css={dcss`
              @apply mb-3 text-sm;
            `}
          >
            <div>
              <strong>type:</strong>
              <span className={styles.PropListTypeDefinition}>{prop.type}</span>
            </div>
            {prop.defaultValue && (
              <div className="mt-1">
                <strong>default:</strong>
                <code className={styles.PropListDefaultValue}>
                  {prop.defaultValue}
                </code>
              </div>
            )}
          </div>
        </React.Fragment>
      ))}
    </>
  );
}

export default PropsTable;
