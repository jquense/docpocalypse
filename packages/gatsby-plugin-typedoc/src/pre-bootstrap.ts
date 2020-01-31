/* eslint-disable @typescript-eslint/no-use-before-define */

import fs from 'fs';
import path from 'path';
import { Application } from 'typedoc';
import { findConfigFile, readConfigFile, sys } from 'typescript';
import * as T from './types';

interface GatsbyNode {
  id: string;
}

type DocNode =
  | T.SignatureReflection
  | T.ParameterReflection
  | T.DeclarationReflection
  | T.TypeParameterReflection
  | T.ProjectReflection
  | T.ContainerReflection;

interface PluginOptions {
  projects: string[];
  [key: string]: any;
}

export function createNodes({ reporter }, pluginOptions: PluginOptions) {
  const nodes = new Map();

  const { projects, ...typedocOptions } = pluginOptions;

  const roots = ([] as string[]).concat(projects);

  roots.forEach((root, idx) => {
    const createId = id => `${idx}:${id}`;

    function findDeclarations(type?: T.SomeType, parent?: string): any[] {
      const find = (t?: T.SomeType) => findDeclarations(t, parent);
      if (type) {
        if ('declaration' in type && type.declaration) {
          return [
            // pointer
            !('name' in type.declaration)
              ? nodes.get(createId(type.declaration.id)) ||
                createId(type.declaration.id)
              : traverse(type.declaration, parent)
          ];
        }
        if ('elementType' in type) return find(type.elementType);
        if ('constraint' in type) return find(type.constraint);
        if ('target' in type) return find(type.target);

        if ('types' in type) return type.types?.flatMap(find) || [];
        if ('elements' in type) return type.elements?.flatMap(find) || [];
        if ('typeArguments' in type)
          return type.typeArguments?.flatMap(find) || [];
      }
      return [];
    }

    function traverse(docNode: DocNode, parent?: string): GatsbyNode {
      const nodeId = createId(docNode.id);

      if (nodes.has(docNode.id)) {
        return { id: nodeId };
      }

      const dnode: any = docNode;
      const typedocs = dnode.children?.map(c => traverse(c, nodeId)) ?? [];
      const signatures = dnode.signatures?.map(c => traverse(c, nodeId)) ?? [];
      const parameters = dnode.parameters?.map(c => traverse(c, nodeId)) ?? [];

      const typeParameter = dnode.typeParameter
        ? [].concat(dnode.typeParameter).map(tp => traverse(tp, nodeId))
        : [];

      [
        'type',
        'overwrites',
        'inheritedFrom',
        'extendedTypes',
        'extendedBy',
        'implementedTypes',
        'implementedBy',
        'implementationOf'
      ].forEach(field => findDeclarations((docNode as any)[field], nodeId));

      const node: any = {
        ...docNode,
        parent,
        id: nodeId,
        typedocs,
        signatures,
        parameters,
        typeParameter,
        sources: ('sources' in docNode && docNode.sources) || [],
        groups:
          ('groups' in docNode &&
            docNode.groups?.map(group => ({
              ...group,
              children: group.children?.map(id => createId(id))
            }))) ||
          []
      };
      console.log('add', node.name);
      nodes.set(docNode.id, node);

      return node;
    }

    const isFile = fs.statSync(root).isFile();

    const tsconfig = isFile ? root : findConfigFile(root, sys.fileExists);

    if (!tsconfig) {
      reporter.info(
        `No typescript project detected for source ${root} skipping`
      );
      return;
    }
    reporter.info(
      `Typescript config found for source ${root}, generating type information`
    );

    const { config, error } = readConfigFile(tsconfig, sys.readFile);

    if (error) {
      reporter.error(error);
      if (!config) return;
    }

    const app = new Application({
      ...typedocOptions,
      mode: 'modules',
      // excludeNotExported: true,
      tsconfig
    });

    const rootDir = path.join(
      path.dirname(tsconfig),
      config.compilerOptions?.rootDir ?? ''
    );

    const project = app.convert(app.expandInputFiles([rootDir]));

    if (!project) {
      reporter.error('There was a problem building your typedoc project');
      return;
    }

    const data = app.serializer.projectToObject(project);

    if (data) {
      traverse(data);
      // graph.set(root, new Map(nodes));
    } else {
      reporter.error('Failed to generate TypeDoc');
      // graph.set(root, null);
    }

    // nodes.clear();
  });

  return nodes;
}
