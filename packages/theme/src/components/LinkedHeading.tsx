import React from 'react';
import Anchor from './Anchor';
import Heading from './OutlineHeading';

function LinkedHeading({ h, id, children }) {
  return (
    <Heading h={h} id={id} title={children}>
      <Anchor target={id}>{children}</Anchor>
    </Heading>
  );
}

export default LinkedHeading;
