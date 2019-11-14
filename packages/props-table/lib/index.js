"use strict";

exports.__esModule = true;
exports.default = renderProps;

var _react = _interopRequireDefault(require("react"));

var _DefaultValue = _interopRequireDefault(require("./DefaultValue"));

var _PropTypeValue = _interopRequireDefault(require("./PropTypeValue"));

var _TypescriptTypeValue = _interopRequireDefault(require("./TypescriptTypeValue"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var isElementType = function isElementType(name, types) {
  return types.some(function (t) {
    if (typeof t === 'string') return t === name;
    return !!name.match(t);
  });
};

function renderProps(propsData, _temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      tokenMap = _ref.tokenMap,
      _ref$elementTypes = _ref.elementTypes,
      elementTypes = _ref$elementTypes === void 0 ? ['elementType', /React\.ComponentType(<.*>)?/] : _ref$elementTypes;

  return propsData.filter(function (prop) {
    return prop.type && !prop.doclets.find(function (d) {
      return d.tag === 'private' || d.tag === 'ignore';
    });
  }).map(function (propData) {
    var name = propData.name,
        type = propData.type,
        defaultValue = propData.defaultValue,
        description = propData.description,
        doclets = propData.doclets,
        tsType = propData.tsType;
    var docletMap = (0, _utils.docletsToMap)(doclets);
    var typeName = (0, _utils.getTypeName)(propData);
    var descHtml = description && description.childMarkdownRemark && description.childMarkdownRemark.html || '';
    var renderedType = null;
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
      name: name,
      doclets: doclets,
      typeName: typeName,
      description: descHtml,
      deprecated: docletMap.get('deprecated'),
      type: renderedType,
      defaultValue: defaultValue && _react.default.createElement(_DefaultValue.default, _extends({}, defaultValue, {
        isElementType: isElementType(typeName, elementTypes)
      })),
      propData: propData
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