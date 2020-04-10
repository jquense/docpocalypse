import sortBy from 'lodash/sortBy';
import React from 'react';

import DefaultValue from './DefaultValue';
import PropTypeValue, { PropType } from './PropTypeValue';
import TypescriptTypeValue, { TSType, TokenMap } from './TypescriptTypeValue';
import { Doclet, docletsToMap, getTypeName } from './utils';

export interface Prop {
  name: string;
  tags: Doclet[];
  docblock?: string;
  defaultValue?: {
    value: any;
    computed: boolean;
  };
  description?: {
    mdx?: { body: string };
    markdownRemark?: { html: string };
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
    elementTypes = ['elementType', /React\.ComponentType(<.*>)?/],
  }: RenderPropsOptions = {},
) {
  return sortBy(propsData, 'name')
    .filter(
      prop => !prop.tags.find(d => d.name === 'private' || d.name === 'ignore'),
    )
    .map(propData => {
      const { name, type, defaultValue, description, tags, tsType } = propData;

      const docletMap = docletsToMap(tags);
      const typeName = getTypeName(propData);

      const descHtml = description?.markdownRemark?.html || '';

      let renderedType = null;
      if (tsType)
        renderedType = (
          <TypescriptTypeValue type={tsType} tags={tags} tokens={tokenMap} />
        );
      else if (type)
        renderedType = (
          <PropTypeValue type={type} tags={tags} tokens={tokenMap} />
        );

      return {
        name,
        tags,
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
        propData,
      };
    });
}
