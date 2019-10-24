import theme from '../theme';

const { breakpoints } = theme;
const keys = Object.keys(breakpoints);

export function breakpointUp(breakpoint: string) {
  const next =
    breakpoints[Math.min(keys.indexOf(breakpoint) + 1, keys.length - 1)];

  return `@media (max-width: ${theme.breakpoints[next] - 0.2}px)`;
}

export function breakpointDown(breakpoint: string) {
  const value = breakpoints[breakpoint];
  return `@media (min-width: ${value}px)`;
}
