import { Link } from 'gatsby';
import React from 'react';

interface Props {
  children?: React.ReactNode;
}

function ShadowLink({ children }: Props) {
  return <Link to="/shadowing">{children || 'shadow'}</Link>;
}

export default ShadowLink;
