"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = renderProps;

var _react = _interopRequireDefault(require("react"));

var _DefaultValue = _interopRequireDefault(require("./DefaultValue"));

var _PropTypeValue = _interopRequireDefault(require("./PropTypeValue"));

var _TypescriptTypeValue = _interopRequireDefault(require("./TypescriptTypeValue"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isElementType = (name, types) => {
  return types.some(t => {
    if (typeof t === 'string') return t === name;
    return !!name.match(t);
  });
};

function renderProps(propsData, {
  tokenMap,
  elementTypes = ['elementType', /React\.ComponentType(<.*>)?/]
} = {}) {
  return propsData.filter(prop => prop.type && !prop.doclets.find(d => d.tag === 'private' || d.tag === 'ignore')).map(propData => {
    const {
      name,
      type,
      defaultValue,
      description,
      doclets,
      tsType
    } = propData;
    const docletMap = (0, _utils.docletsToMap)(doclets);
    const typeName = (0, _utils.getTypeName)(propData);
    const descHtml = description && description.childMarkdownRemark && description.childMarkdownRemark.html || '';
    let renderedType = null;
    if (tsType) renderedType = _react.default.createElement(_TypescriptTypeValue.default, {
      type: tsType,
      doclets: doclets,
      tokens: tokenMap
    });else if (type) renderedType = _react.default.createElement(_PropTypeValue.default, {
      type: type,
      doclets: doclets,
      tokens: tokenMap
    });
    return {
      name,
      doclets,
      typeName,
      description: descHtml,
      deprecated: docletMap.get('deprecated'),
      type: renderedType,
      defaultValue: defaultValue && _react.default.createElement(_DefaultValue.default, Object.assign({}, defaultValue, {
        isElementType: isElementType(typeName, elementTypes)
      })),
      propData
    };
  });
} // class PropsTable extends React.Component<PropsTableProps> {
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