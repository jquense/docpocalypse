import { useMemo, useRef, useState, ReactNode, useCallback } from 'react';
import useAnimationFrame from '@restart/hooks/useAnimationFrame';
import React from 'react';

export interface Node {
  id: string;
  level: number;
  title: ReactNode;
  children?: Node[];
}

export interface Tree {
  children: Node[];
}

export const DocumentOutlineContext = React.createContext<{
  tree: Tree | null;
  registerNode(level: number, title: ReactNode, id: string): () => void;
}>(null as any);

function toTree(list: Iterable<Node>): Tree {
  let map: Record<string, Node[]> = {};
  let root: Tree = { children: [] };
  let parents = [] as Node[];
  let last: Node | null = null;

  // eslint-disable-next-line
  for (let item of list) {
    if (last && item.level > last.level) parents.push(last);
    if (last && item.level < last.level) parents.pop();
    last = item;
    let parent = parents[parents.length - 1];

    map[item.id] = map[item.id] || [];
    item.children = map[item.id];

    if (parent) {
      map[parent.id] = map[parent.id] || [];
      map[parent.id].push(item);
    } else root.children.push(item);
  }

  return root;
}

export default function DocumentOutlineProvider({ children }: any) {
  const list = useRef(new Map<string, Node>()).current;
  const animationFrame = useAnimationFrame();
  const [tree, setTree] = useState<Tree>({ children: [] });

  const registerNode = useCallback(
    (level: number, title: string, id: string) => {
      if (level === 1) return () => {};

      list.set(id, { level, title, id });

      animationFrame.request(() => {
        setTree(toTree(list.values()));
      });

      return () => {
        list.delete(id);
      };
    },
    [list, animationFrame],
  );

  const context = useMemo(() => ({ registerNode, tree }), [
    registerNode,
    tree,
  ]);

  return (
    <DocumentOutlineContext.Provider value={context}>
      {children}
    </DocumentOutlineContext.Provider>
  );
}
