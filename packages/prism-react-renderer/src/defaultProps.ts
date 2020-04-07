// @ts-ignore
import theme from './themes/duotoneDark';
import { PrismLib } from './types';
import Prism from './prism';

const defaultProps = {
  Prism: Prism as PrismLib,
  theme,
};

export default defaultProps;
