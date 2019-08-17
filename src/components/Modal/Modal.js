import React from 'react';
import ReactDOM from 'react-dom';
import { clamp } from 'lodash';
import styled from 'styled-components';
import { color, size, transition } from '../../theme';
import useMeasure from '../../hooks/useMeasure';
import { rgba } from 'polished';
import { absoluteFill, alignCenter } from '../../mixins';

const Container = styled.div`
  ${absoluteFill()}
  ${alignCenter()}
  pointer-events: none;
  background-color: ${rgba(color.white, 0)};
  transition: background-color 0.3s ease-in-out;
  transform: translateZ(0);
  ${p => p.isOpen && `
    background-color: ${p.backgroundColor};
    pointer-events: inherit;
  `}
`

const ModalContainer = styled.div`
  border-radius: ${size.SMALL}px;
  opacity: 0;
  transition:
    opacity 0.15s ease-in-out,
    transform ${transition};
`

const BGLayerContainer = styled.div`
  ${absoluteFill()}
  pointer-events: none;
`

const Modal = (props) => {
  const {
    modalRef,
    isOpen,
    toggleModal,
    width,
    height,
    children,
    zIndex,
    style,
    inTransform,
    outTransform,
    backgroundColor,
    onClickStopPropagation,
    backgroundLayer,
  } = props;

  return ReactDOM.createPortal(
    <Container
      isOpen={isOpen}
      onClick={toggleModal}
      backgroundColor={backgroundColor}
      style={{
        zIndex,
      }}
    > 
      <BGLayerContainer>
        { backgroundLayer }
      </BGLayerContainer>
      <ModalContainer
        ref={modalRef}
        style={{
          width,
          height,
          opacity: isOpen ? 1 : 0,
          transform: isOpen
            ? inTransform
            : outTransform,
          ...style,
        }}
      >
        { children }
      </ModalContainer>
    </Container>,
    document.body,
  )
}

Modal.defaultProps = {
  zIndex: 2,
  style: {},
  inTransform: `translate3d(0px, 0px, 0px)`,
  outTransform: `translate3d(0px, 0px, 0px)`,
  backgroundColor: rgba(color.white, 0.6),
  backgroundLayer: null,
}

export default Modal;