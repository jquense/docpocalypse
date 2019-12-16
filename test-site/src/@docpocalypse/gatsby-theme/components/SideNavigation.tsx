import React from 'react';
import BaseSideNavigation from '@docpocalypse/gatsby-theme/src/components/SideNavigation';

const groupBy = d => d.packageName.replace(/@.+\//, '');

function SideNavigation(props) {
  return <BaseSideNavigation groupComponentsBy={groupBy} {...props} />;
}

export default SideNavigation;
