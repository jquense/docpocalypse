import React, { useContext } from 'react';
import DocumentOutlineItem from './DocumentOutlineItem';
import { DocumentOutlineContext, Node, Tree } from './DocumentOutlineProvider';
import SidePanel from './SidePanel';

function renderNode(root: Tree | Node) {
  return (
    <>
      {'title' in root && <a href={`#${root.id}`}>{root.title}</a>}
      <ul>
        {root.children!.map((item, idx) => (
          // eslint-disable-next-line react/no-array-index-key
          <DocumentOutlineItem key={idx}>
            {renderNode(item)}
          </DocumentOutlineItem>
        ))}
      </ul>
    </>
  );
}

function DocumentOutline(props: any) {
  const ctx = useContext(DocumentOutlineContext);
  // TODO: warn instead
  if (!ctx) return null;

  return <SidePanel {...props}>{ctx.tree && renderNode(ctx.tree)}</SidePanel>;
}

export default DocumentOutline;
