import dstyled from 'astroturf';
import React from 'react';

function InlineCode(props: React.HTMLAttributes<HTMLElement>) {
  return <code {...props} />;
}

export default dstyled(InlineCode)`
  @component InlineCode & {
    @theme full minimal {
      @apply text-accent leading-tight px-1 bg-subtle rounded-sm;
    }
  }
`;
