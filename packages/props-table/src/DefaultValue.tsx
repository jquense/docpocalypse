import React from 'react';

interface Props {
  value: any;
  computed: boolean;
  isElementType: boolean;
}

function DefaultValue({ value, isElementType }: Props) {
  if (value == null || value === 'undefined') return null;
  // eslint-disable-next-line no-param-reassign
  if (isElementType) value = `<${value.replace(/('|")/g, '')}>`;

  return <code>{value}</code>;
}

export default DefaultValue;
