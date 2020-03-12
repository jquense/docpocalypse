import useAnimationFrame from '@restart/hooks/useAnimationFrame';
import React, {
  ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';

export interface Node {
  id: string;
  level: number;
  title: ReactNode;
  children?: Node[];
}

export interface Tree {
  children: Node[];
}

export const DocumentOutlineContext = React.createContext<null | {
  tree: Tree | null;
  registerNode(level: number, title: ReactNode, id: string): void;
}>(null);

function toTree(list: Iterable<Node>): Tree {
  const map: Record<string, Node[]> = {};
  const root: Tree = { children: [] };
  const parents = [] as Node[];
  let last: Node | null = null;

  // eslint-disable-next-line
  for (let item of list) {
    // const item = list.get(key)!;
    if (last && item.level > last.level) parents.push(last);
    if (last && item.level < last.level) parents.pop();
    last = item;
    const parent = parents[parents.length - 1];

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
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      if (level === 1) {
        list.clear();
        return;
      }

      list.set(id, { level, title, id });

      animationFrame.request(() => {
        setTree(toTree(list.values()));
      });
    },
    [list, animationFrame],
  );

  const context = useMemo(() => ({ registerNode, tree }), [registerNode, tree]);

  return (
    <DocumentOutlineContext.Provider value={context}>
      {children}
    </DocumentOutlineContext.Provider>
  );
}
