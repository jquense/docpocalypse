import { Anchor } from '@docpocalypse/gatsby-theme';
import React from 'react';

interface Props {
  children?: React.ReactNode;
}

function ShadowLink({ children }: Props) {
  return <Anchor href="/shadowing">{children || 'shadow'}</Anchor>;
}

export default ShadowLink;
