import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { rgba } from 'polished';
import Icon from '../../components/Icon';
import { absoluteFill, alignCenter } from '../../mixins';
import { font, color, transition } from '../../theme';

const Container = styled.div`
  ${absoluteFill()};
  background-color: ${color.white};
  z-index: 20;
  ${alignCenter()}
  transition: opacity ${transition};

`

const ContentContainer = styled.div`
  position: relative;
  ${font.HEADER_M(color.gray300)}
  transition: all ${transition};
  ${alignCenter()}
  color: ${rgba(color.red, 0.4)}
`

const Splash = (props) => {

  const {
    isLoaded,
  } = props;

  const [initialLoad, setInitialLoad] = useState(true);

  const [loaded, setLoaded] = useState(false);
  
  const [mounted, setMounted] = useState(true);

  const finalLoaded = loaded && isLoaded;

  useEffect(() => {
    setInitialLoad(false);
  }, [])

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 1000)
  }, []);

  useEffect(() => {
    if (!finalLoaded) return;
    setTimeout(() => {
      setMounted(false);
    }, 1000)
  }, [finalLoaded])

  return mounted
    ? ReactDOM.createPortal(
      <Container
        style={{
          opacity: !finalLoaded ? 1 : 0,
        }}
      >
        <ContentContainer
          style={{
            opacity: initialLoad ? 0 : 1,
            transform: initialLoad || finalLoaded ? `scale(2)` : `scale(1)`,
          }}
        >
          <Icon size={100} icon="heart" />
        </ContentContainer>
      </Container>,
      document.body
    ) : null;
}

export default Splash;