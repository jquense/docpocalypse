import cn from 'classnames';
import React, { ReactNode } from 'react';

export type ResponsiveValue<T> = T | Record<string, T>;

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
    'none' | 'block' | 'flex' | 'inline' | 'inline-flex' | 'inline-block'
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
  direction?: ResponsiveValue<
    'row' | 'column' | 'row-reverse' | 'column-reverse'
  >;
  grow?: ResponsiveValue<number | string>;
  shrink?: ResponsiveValue<number | string>;
  fill?: ResponsiveValue<number | string>;
  order?: ResponsiveValue<number | string>;
}

const propsConfig = {
  grid: true,
  display: 'd',
  direction: 'flex',
  align: 'align-items',
  alignSelf: 'align-self',
  alignContent: 'align-content',
  justify: 'justify-content',
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
  maxHeight: 'mh',
};

type Keys = keyof BoxProps<any>;

const getSegment = breakpoint =>
  breakpoint === '_' || breakpoint === 'xs' ? '' : `${breakpoint}-`;

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
    vw100 && 'vw-100',
  );

  Object.keys(propsConfig).forEach((key: Keys) => {
    const classPrefix = propsConfig[key];
    // @ts-ignore
    const value = props[key];

    if (!classPrefix || value == null) return;

    // @ts-ignore
    delete props[key]; // eslint-disable-line no-param-reassign

    const suffix = value === true ? key : value;
    if (classPrefix === true && value === true) {
      classes = cn(classes, key);
    } else if (value && typeof value === 'object') {
      classes = cn(
        classes,
        Object.entries(value)
          .map(
            ([breakpoint, rValue]) =>
              `${classPrefix}-${getSegment(breakpoint)}${rValue}`,
          )
          .join(' '),
      );
    } else {
      classes = cn(classes, `${classPrefix}-${suffix}`);
    }
  });

  return <Tag className={classes} {...props} />;
}

Box.defaultProps = {
  as: 'div',
  // display: 'flex',
};

export default Box;
