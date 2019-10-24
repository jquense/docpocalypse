import React from 'react';
import DefaultValue from './DefaultValue';
import PropTypeValue, { PropType } from './PropTypeValue';
import { TSType } from './TypescriptTypeValue';
import { Doclet, docletsToMap, getDoclet, getTypeName } from './utils';

export interface Prop {
  name: string;
  doclets: Doclet[];
  docblock?: string;
  defaultValue?: {
    value: any;
    computed: boolean;
  };
  description?: {
    childMdx?: { body: string };
    childMarkdownRemark?: { html: string };
  };
  required: boolean;
  type: null | PropType;
  tsType: TSType | null;
}

interface PropsTableProps {
  propsData: Prop[];
  className?: string;
}

const isElementType = (name: string, types: Array<string | RegExp>) => {
  return types.some(t => {
    if (typeof t === 'string') return t === name;
    return !!name.match(t);
  });
};

export default function renderProps(
  propsData: Prop[],
  elementTypes: Array<string | RegExp> = [
    'elementType',
    /React\.ComponentType(<.*>)?/,
  ],
) {
  return propsData
    .filter(
      prop =>
        prop.type &&
        !prop.doclets.find(d => d.tag === 'private' || d.tag === 'ignore'),
    )
    .map(propData => {
      const { name, type, defaultValue, description, doclets } = propData;

      const docletMap = docletsToMap(doclets);
      const typeName = getTypeName(propData);

      const descHtml =
        (description &&
          description.childMarkdownRemark &&
          description.childMarkdownRemark.html) ||
        '';

      return {
        name,
        doclets,
        typeName,
        description: descHtml,
        deprecated: docletMap.get('deprecated'),
        type: type && <PropTypeValue type={type} doclets={doclets} />,
        defaultValue: defaultValue && (
          <DefaultValue
            {...defaultValue}
            isElementType={isElementType(typeName, elementTypes)}
          />
        ),
        propData,
      };
    });
}

// class PropsTable extends React.Component<PropsTableProps> {
//   renderRequiredBadge(prop: Prop) {
//     if (!prop.required) {
//       return null;
//     }

//     return <span>required</span>;
//   }

//   render() {
//     const { propsData, className } = this.props;

//     const filtered = propsData.filter(
//       prop =>
//         prop.type &&
//         !prop.doclets.find(d => d.tag === 'private' || d.tag === 'ignore'),
//     );

//     if (!filtered.length) {
//       return null;
//     }

//     return (
//       <table className={`${className || ''} props-table`}>
//         <thead>
//           <tr className="props-table-row">
//             <th className="props-table-header">Name</th>
//             <th className="props-table-header">Type</th>
//             <th className="props-table-header">Default</th>
//             <th className="props-table-header">Description</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filtered.map(propData => {
//             const {
//               name,
//               type,
//               defaultValue,
//               description,
//               doclets,
//             } = propData;

//             const descHtml =
//               (description &&
//                 description.childMarkdownRemark &&
//                 description.childMarkdownRemark.html) ||
//               '';

//             const deprecated = getDoclet(doclets, 'deprecated');

//             return (
//               <tr key={name} className="props-table-row">
//                 <td className="props-table-cell  props-table-cell__name">
//                   {name} {this.renderRequiredBadge(propData)}
//                 </td>
//                 <td className="props-table-cell props-table-cell__type">
//                   {type && <PropTypeValue type={type} doclets={doclets} />}
//                 </td>

//                 <td className="props-table-cell  props-table-cell__default-value">
//                   {defaultValue && (
//                     <DefaultValue
//                       {...defaultValue}
//                       isElementType={getTypeName(propData) === 'elementType'}
//                     />
//                   )}
//                 </td>

//                 <td className="props-table-cell">
//                   {deprecated && (
//                     <div className="mb-1">
//                       <strong className="text-danger">
//                         {`Deprecated: ${deprecated} `}
//                       </strong>
//                     </div>
//                   )}

//                   <div dangerouslySetInnerHTML={{ __html: descHtml }} />
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     );
//   }
// }

// export default PropsTable;
