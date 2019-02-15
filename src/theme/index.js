
export const color = {
  primaryAccent: '#3633FF',
  secondaryAccent: '#66D4FF',
  primaryBackground: '#ffffff',
  primaryText: '#222222',
  secondaryText: '#444444',
  black: '#000000',
  white: '#ffffff',
};

export const size = {
  TINY: 4,
  SMALL: 8,
  NORMAL: 14,
  MEDIUM: 16,
  LARGE: 24,
  XLARGE: 36,
}

export const transition = '0.5s cubic-bezier(.4,0,0,1)';

export const panelStyle = () => css`
  background-color: ${color.primaryBackground};
  transform: translateZ(0);
  box-shadow:
    inset 0px -1px 2px 0px ${rgba(color.white, 0.08)},
    0px 4px 8px 0px ${rgba(color.black, 0.4)};
`


const theme = {
  color,
  size,
  transition,
};

export default theme;