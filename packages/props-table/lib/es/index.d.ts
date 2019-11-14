/// <reference types="react" />
import { PropType } from './PropTypeValue';
import { TSType, TokenMap } from './TypescriptTypeValue';
import { Doclet } from './utils';
export interface Prop {
    name: string;
    doclets: Doclet[];
    docblock?: string;
    defaultValue?: {
        value: any;
        computed: boolean;
    };
    description?: {
        childMdx?: {
            body: string;
        };
        childMarkdownRemark?: {
            html: string;
        };
    };
    required: boolean;
    type: null | PropType;
    tsType: TSType | null;
}
export interface RenderPropsOptions {
    tokenMap?: TokenMap;
    elementTypes?: Array<string | RegExp>;
}
export default function renderProps(propsData: Prop[], { tokenMap, elementTypes }?: RenderPropsOptions): {
    name: string;
    doclets: Doclet[];
    typeName: string;
    description: string;
    deprecated: string | undefined;
    type: JSX.Element | null;
    defaultValue: JSX.Element | undefined;
    propData: Prop;
}[];
//# sourceMappingURL=index.d.ts.map