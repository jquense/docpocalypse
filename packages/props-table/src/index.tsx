import sortBy from 'lodash/sortBy';
import React from 'react';
import DefaultValue from './DefaultValue';
import PropTypeValue, { PropType } from './PropTypeValue';
import TypescriptTypeValue, { TSType, TokenMap } from './TypescriptTypeValue';
import { Doclet, docletsToMap, getTypeName } from './utils';

export interface Prop {
  name: string;
  doclets: Doclet[];
  docblock?: string;
  defaultValue?: {
    value: any;
    computed: boolean;
  };
  description?: {
    childMdx?: { body: string };
    childMarkdownRemark?: { html: string };
  };
  required: boolean;
  type: null | PropType;
  tsType: TSType | null;
}

interface PropsTableProps {
  propsData: Prop[];
  className?: string;
}

const isElementType = (name: string, types: Array<string | RegExp>) => {
  return types.some(t => {
    if (typeof t === 'string') return t === name;
    return !!name.match(t);
  });
};

export interface RenderPropsOptions {
  tokenMap?: TokenMap;
  elementTypes?: Array<string | RegExp>;
}
export default function renderProps(
  propsData: Prop[],
  {
    tokenMap,
    elementTypes = ['elementType', /React\.ComponentType(<.*>)?/]
  }: RenderPropsOptions = {}
) {
  return sortBy(propsData, 'name')
    .filter(
      prop =>
        prop.type &&
        !prop.doclets.find(d => d.tag === 'private' || d.tag === 'ignore')
    )
    .map(propData => {
      const {
        name,
        type,
        defaultValue,
        description,
        doclets,
        tsType
      } = propData;

      const docletMap = docletsToMap(doclets);
      const typeName = getTypeName(propData);

      const descHtml =
        (description &&
          description.childMarkdownRemark &&
          description.childMarkdownRemark.html) ||
        '';

      let renderedType = null;
      if (tsType)
        renderedType = (
          <TypescriptTypeValue
            type={tsType}
            doclets={doclets}
            tokens={tokenMap}
          />
        );
      else if (type)
        renderedType = (
          <PropTypeValue type={type} doclets={doclets} tokens={tokenMap} />
        );

      return {
        name,
        doclets,
        typeName,
        description: descHtml,
        deprecated: docletMap.get('deprecated'),
        type: renderedType,
        defaultValue: defaultValue && (
          <DefaultValue
            {...defaultValue}
            isElementType={isElementType(typeName, elementTypes)}
          />
        ),
        propData
      };
    });
}
