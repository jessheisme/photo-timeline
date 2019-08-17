import React from 'react';
import styled from 'styled-components';
import FeatherIcon from 'feather-icons-react';
import { size } from '../../theme';

const ICON_SIZE = 16;

const Container = styled.div`
  position: relative;
  width: ${ICON_SIZE}px;
  height: ${ICON_SIZE}px;
`

const icons = {
  'one-up': <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path d="M 2 5 C 2 3.895 2.895 3 4 3 L 12 3 C 13.105 3 14 3.895 14 5 L 14 11 C 14 12.105 13.105 13 12 13 L 4 13 C 2.895 13 2 12.105 2 11 Z" fill="transparent" stroke="currentColor"></path></svg>,
  'two-up': <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path d="M 2 5 C 2 3.895 2.895 3 4 3 L 12 3 C 13.105 3 14 3.895 14 5 L 14 11 C 14 12.105 13.105 13 12 13 L 4 13 C 2.895 13 2 12.105 2 11 Z" fill="transparent" stroke="currentColor"></path><path d="M 8 3 L 8 13" fill="transparent" stroke="currentColor"></path></svg>,
  'one-up-timeline': <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path d="M 2 5 C 2 3.895 2.895 3 4 3 L 12 3 C 13.105 3 14 3.895 14 5 L 14 11 C 14 12.105 13.105 13 12 13 L 4 13 C 2.895 13 2 12.105 2 11 Z" fill="transparent" stroke="currentColor"></path><path d="M 2 10 L 14 10" fill="transparent" stroke="currentColor"></path></svg>,
  'two-up-timeline': <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path d="M 2 5 C 2 3.895 2.895 3 4 3 L 12 3 C 13.105 3 14 3.895 14 5 L 14 11 C 14 12.105 13.105 13 12 13 L 4 13 C 2.895 13 2 12.105 2 11 Z" fill="transparent" stroke="currentColor"></path><path d="M 2 10 L 14 10" fill="transparent" stroke="currentColor"></path><path d="M 8 3 L 8 10" fill="transparent" stroke="currentColor"></path></svg>
}

const Icon = (props) => {
  const {
    icon,
    size,
  } = props;
  return (
    <Container
      style={{
        ...props.style,
        width: props.size,
        height: props.size,
      }}
    >
      { icons[icon]
          ? icons[icon]
          : <FeatherIcon icon={props.icon} size={props.size} />
      }
    </Container>
  )
}

Icon.defaultProps = {
  style: {},
  size: size.MEDIUM
};

export default Icon;