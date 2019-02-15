import React from 'react';
import styled from 'styled-components';
import { transition as themeTransition } from '../../../../theme';

const Container = styled.div`
  position: absolute;
  left: 0px;
  top: 0px;
  background-color: transparent;
`

class Panel extends React.Component {

  render() {
    const {
      layout,
      dragBindings,
      disableTransitions,
      children: renderChildren,
    } = this.props;
    const {
      key,
      x,
      y,
      width,
      height,
      transitionDelays,
      isHidden,
      zIndex,
      disableDragging,
      transform: initialTransform,
      disablePointerEvents,
    } = layout;
    const transition = dragBindings.isDragging || disableTransitions
      ? 'none'
      : `all ${themeTransition}`;
    const transform = initialTransform || `translate3d(${x}px, ${y}px, 0px)`;
    return (
      <Container
        key={key}
        isDragging={dragBindings.isDragging}
        transitionDelays={transitionDelays}
        {...((!disableDragging && dragBindings) || {})}
        style={{
          width,
          height,
          transform,
          opacity: isHidden ? 0 : 1,
          zIndex,
          ...(isHidden || disablePointerEvents ? { pointerEvents: 'none' } : {}),
          transition,
        }}
      >
        { renderChildren(layout) }
      </Container>
    );
  }
  static defaultProps = {
    dragBindings: {},
  };
}

export default Panel;