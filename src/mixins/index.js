import { css } from 'styled-components';
import { position } from 'polished';

export const absoluteFill = () => position('absolute', 0, 0, 0, 0);

export const alignCenter = (inline = false) => css`
  display: ${inline ? 'inline-flex' : 'flex'};
  align-items: center;
  justify-content: center;
`;

export const buttonReset = (cursor = 'pointer') => css`
  background: none;
  border: 0;
  padding: 0;
  ${cursor && `&:not(:disabled) { cursor: ${cursor}; }`}
  &:focus { outline: none; }
`;

export const backgroundImage = (image, size='cover') => css`
  background-size: ${size};
  background-position: center;
  background-repeat: no-repeat;
  ${ image && `background-image: url(${image});` }
`

export const transparent = () => css`
  background-color: transparent;
`;

export const circle = (size) => css`
  position: relative;
  width: ${size}px;
  height: ${size}px;
  box-sizing: border-box;
  border-radius: 50%;
  transform: translateZ(0);
`