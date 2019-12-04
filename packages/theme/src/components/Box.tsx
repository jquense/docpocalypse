import cn from 'classnames';
import React, { ReactNode } from 'react';
import config from '../../tailwind.config';

export type ResponsiveValue<T> = T | Record<string, T>;

const { prefix = '', separator = ':' } = config;

type Items =
  | 'start'
  | 'end'
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'stretch'
  | 'baseline'
  | 'first-baseline'
  | 'last-baseline';

type Content =
  | 'left'
  | 'right'
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'baseline'
  | 'first-baseline'
  | 'last-baseline'
  | 'space-between'
  | 'space-around'
  | 'space-evenly';

export interface BoxProps<As extends React.ElementType = 'div'> {
  as?: As;
  className?: string;
  children?: ReactNode;
  grid?: boolean;
  display?: ResponsiveValue<
    'hidden' | 'block' | 'flex' | 'inline' | 'inline-flex' | 'inline-block'
  >;
  width?: ResponsiveValue<'auto' | '25' | '50' | '75' | '100'>;
  maxWidth?: ResponsiveValue<'auto' | '25' | '50' | '75' | '100'>;
  height?: ResponsiveValue<'auto' | '25' | '50' | '75' | '100'>;
  maxHeight?: ResponsiveValue<'auto' | '25' | '50' | '75' | '100'>;
  minVh100?: boolean;
  minVw100?: boolean;
  vh100?: boolean;
  vw100?: boolean;

  col?: ResponsiveValue<
    1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'auto'
  >;
  gap?: ResponsiveValue<number | string>;
  gapRow?: ResponsiveValue<number | string>;
  gapColumn?: ResponsiveValue<number | string>;

  m?: ResponsiveValue<number | string>;
  mt?: ResponsiveValue<number | string>;
  mr?: ResponsiveValue<number | string>;
  mb?: ResponsiveValue<number | string>;
  ml?: ResponsiveValue<number | string>;
  mx?: ResponsiveValue<number | string>;
  my?: ResponsiveValue<number | string>;

  p?: ResponsiveValue<number | string>;
  pt?: ResponsiveValue<number | string>;
  pr?: ResponsiveValue<number | string>;
  pb?: ResponsiveValue<number | string>;
  pl?: ResponsiveValue<number | string>;
  px?: ResponsiveValue<number | string>;
  py?: ResponsiveValue<number | string>;

  align?: ResponsiveValue<Items>;
  alignContent?: ResponsiveValue<Content>;
  alignSelf?: ResponsiveValue<Items>;
  justifyContent?: ResponsiveValue<Content>;
  wrap?: ResponsiveValue<'wrap' | 'no-wrap' | 'wrap-reverse'>;
  direction?: ResponsiveValue<'row' | 'col' | 'row-reverse' | 'col-reverse'>;
  grow?: ResponsiveValue<number | string>;
  shrink?: ResponsiveValue<number | string>;
  fill?: ResponsiveValue<number | string>;
  order?: ResponsiveValue<number | string>;
}

function getConfig(c: Record<string, any>): Array<[string, string, boolean]> {
  return Object.keys(c).map(key => {
    const configValue = c[key];
    if (Array.isArray(configValue)) return [key, ...configValue];
    return configValue === true ? [key, key, true] : [key, configValue, false];
  }) as any;
}

const propsConfig = getConfig({
  grid: true,

  display: ['', true],
  direction: 'flex',
  align: 'items',
  alignSelf: 'self',
  alignContent: 'content',
  justify: 'justify',
  fill: 'flex',
  wrap: 'flex',
  grow: 'flex',
  shrink: 'flex',
  order: 'order',

  col: 'col',
  gap: 'g',
  gapRow: 'gr',
  gapColumn: 'gc',

  m: 'm',
  mt: 'mt',
  mr: 'mr',
  mb: 'mb',
  ml: 'ml',
  mx: 'mx',
  my: 'my',

  p: 'p',
  pt: 'pt',
  pr: 'pr',
  pb: 'pb',
  pl: 'pl',
  px: 'px',
  py: 'py',

  width: 'w',
  maxWidth: 'mw',
  height: 'h',
  maxHeight: 'mh'
});

type Keys = keyof BoxProps<any>;

function getClassName(
  clsPrefix: string,
  bool: boolean,
  breakpoint = '_',
  value: any
) {
  const bp =
    breakpoint === '_' || breakpoint === 'xs'
      ? ''
      : `${breakpoint}${separator}`;

  if (bool) return !value ? '' : `${prefix}${bp}${clsPrefix || value}`;
  return `${prefix}${bp}${clsPrefix}-${value}`;
}

function Box<T extends React.ElementType = 'div'>({
  as: asProp,
  className,
  minVh100,
  minVw100,
  vh100,
  vw100,
  ...props
}: BoxProps<T> & Omit<React.ComponentProps<T>, Keys>) {
  const Tag: any = asProp || 'div';
  let classes = cn(
    className,
    minVh100 && 'min-vh-100',
    minVw100 && 'min-vw-100',
    vh100 && 'vh-100',
    vw100 && 'vw-100'
  );

  propsConfig.forEach(([key, clsPrefix, isBool]) => {
    // @ts-ignore
    const value = props[key];
    if (value == null) return;
    // @ts-ignore
    delete props[key]; // eslint-disable-line no-param-reassign

    if (typeof value === 'object' && value) {
      classes = cn(
        classes,
        Object.entries(value)
          .map(([breakpoint, rValue]) =>
            getClassName(clsPrefix, isBool, breakpoint, rValue)
          )
          .join(' ')
      );
    } else {
      const cls = getClassName(clsPrefix, isBool, undefined, value);
      if (cls) classes = cn(classes, cls);
    }
  });

  return <Tag className={classes} {...props} />;
}

Box.defaultProps = {
  as: 'div'
  // display: 'flex',
};

export default Box;
