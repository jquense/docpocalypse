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

const shouldHideTree = (tree: Tree | null) => {
  if (!tree) return true;
  const children = tree.children || [];

  if (!children.length) return false;
  // if there is only 1 child make sure it at least has one child
  if (children.length === 1 && !children[0].children?.length) return true;
  return false;
};

function DocumentOutline(props: any) {
  const ctx = useContext(DocumentOutlineContext);

  // TODO: warn instead
  if (!ctx || shouldHideTree(ctx.tree)) return null;

  return <SidePanel {...props}>{renderNode(ctx.tree!)}</SidePanel>;
}

export default DocumentOutline;
