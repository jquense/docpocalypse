import React, { useContext } from 'react';
import SidePanel from './SidePanel';
import DocumentOutlineItem from './DocumentOutlineItem';
import { Tree, Node, DocumentOutlineContext } from './DocumentOutlineProvider';

function renderNode(root: Tree | Node) {
  return (
    <>
      {'title' in root && <a href={`#${root.id}`}>{root.title}</a>}
      <ul className="list-unstyled">
        {root.children!.map((item, idx) => (
          <DocumentOutlineItem key={idx}>
            {renderNode(item)}
          </DocumentOutlineItem>
        ))}
      </ul>
    </>
  );
}

function DocumentOutline(props: any) {
  const { tree } = useContext(DocumentOutlineContext);
  return <SidePanel {...props}>{tree && renderNode(tree)}</SidePanel>;
}

export default DocumentOutline;
