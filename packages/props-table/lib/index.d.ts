/// <reference types="react" />
import { PropType } from './PropTypeValue';
import { TSType } from './TypescriptTypeValue';
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
export default function renderProps(propsData: Prop[], elementTypes?: Array<string | RegExp>): {
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