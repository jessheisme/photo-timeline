import { css } from 'styled-components';
import { rgba } from 'polished';

export const color = {
  purple: '#5b53ff',
  primaryAccent: '#5b53ff',
  secondaryAccent: '#66D4FF',
  primaryBackground: '#15151C',
  primaryText: '#ffffff',
  secondaryText: '#f1f3f6',
  tertiaryText: '#b8c1cf',
  quaternaryText: '#7d829c',
  white: '#ffffff',
  gray100: '#f1f3f6',
  gray200: '#e3e6ec',
  gray300: '#b8c1cf',
  gray400: '#7d829c',
  gray500: '#666a72',
  gray600: '#323745',
  gray700: '#303247',
  gray800: '#20222b',
  gray850: '#191922',
  gray900: '#15151c',
  fioBlack: '#0f0f14',
  black: '#000000',
  red: '#ff4268',
  green: '#13ECCB',
  lightcyan: '#cafffa',
  lightgreen: '#1FC7AD',
  orange: '#ff9340',
  blue: '#4069ff',
  gold: '#B59762',
  cyan: '#60D7FB',
  yellow: '#ffe279',
  magenta: '#E77AFF',
  black20: rgba('#000000', 0.2),
  black40: rgba('#000000', 0.4),
  transparent: rgba('#000000', 0),
};

export const size = {
  TINY: 4,
  SMALL: 8,
  NORMAL: 14,
  MEDIUM: 16,
  LARGE: 24,
  XLARGE: 32,
}

export const fontSize = {
  SMALL: 12,
  NORMAL: 14,
  MEDIUM: 16,
  LARGE: 24,
  XLARGE: 32,
}

export const font = {
  BODY_S: color => css`
    font-size: 12px;
    line-height: 20px;
    color: ${color};
  `,
  BODY_M: color => css`
    font-size: 14px;
    line-height: 22px;
    color: ${color};
  `,
  BODY_L: color => css`
    font-size: 17px;
    line-height: 28px;
    color: ${color};
  `,
  HEADER_XS: color => css`
    font-size: 20px;
    line-height: 24px;
    color: ${color};
  `,
  HEADER_S: color => css`
    font-size: 24px;
    line-height: 30px;
    color: ${color};
  `,
  HEADER_M: color => css`
    font-size: 29px;
    line-height: 36px;
    color: ${color};
  `,
  HEADER_L: color => css`
    font-size: 42px;
    line-height: 50px;
    color: ${color};
  `,
  HEADER_XL: color => css`
    font-size: 50px;
    line-height: 60px;
    color: ${color};
  `,
  HEADER_XXL: color => css`
    font-size: 60px;
    line-height: 72px;
    color: ${color};
  `,
}

export const transition = '0.4s cubic-bezier(.4,0,0,1)';

export const shadow = {
  TINY: (color, inset) => css`
    box-shadow: ${inset ? 'inset' : ''} 0px 0px ${size.SMALL}px 0px ${color};
  `,
}


export const panelStyle = () => css`
  transform: translateZ(0);
`

export const documentText = () => css`
  font-size: 19px;
  line-height: 1.58;
  font-weight: 100;
`

const theme = {
  color,
  size,
  fontSize,
  transition,
};

export default theme;