import React from 'react';
import styled from 'styled-components';
import { absoluteFill, alignCenter } from '../../mixins';
import { panelStyle, size, color } from '../../theme';
import { darken, lighten } from 'polished';

const HEADER_HEIGHT = size.XLARGE;
const FOOTER_HEIGHT = size.LARGE;

const Container = styled.div`
  ${absoluteFill()}
  ${panelStyle()}
`
const Header = styled.div`
  ${panelStyle()}
  position: absolute;
  left: 0px;
  top: 0px;
  right: 0px;
  height: ${HEADER_HEIGHT}px;
  background-color: ${lighten(0.04, color.primaryBackground)};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${size.SMALL}px;
`

const Content = styled.div`
  position: absolute;
  overflow: scroll;
  padding: ${size.SMALL}px;
`

const Footer = styled.div`
  position: absolute;
  left: 0px;
  right: 0px;
  bottom: 0px;
  background-color: ${darken(0.04, color.primaryBackground)};
  padding: ${size.SMALL}px;
`

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-grow: 0;
`

const RightContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-grow: 0;
`

const CenterContentContainer = styled.div`
  ${absoluteFill()}
  ${alignCenter()}
`

const CenterContainer = styled.div`
  position: relative;
`

const Panel = (props) => {
  const {
    width,
    height,
    hasHeader,
    headerLeftContent,
    headerRightContent,
    headerCenterContent,
    footerLeftContent,
    footerRightContent,
    footerCenterContent,
    hasFooter,
    children,
  } = props;

  const contentWidth = width;
  const headerHeight = hasHeader ? HEADER_HEIGHT : 0;
  const footerHeight = hasFooter ? FOOTER_HEIGHT : 0;
  const contentHeight = height - headerHeight - footerHeight;
  const contentBottom = hasFooter ? FOOTER_HEIGHT : 0;
  return (
    <Container>
      <Content
        style={{
          left: 0,
          top: headerHeight,
          bottom: contentBottom,
          right: 0,
        }}
      >
        { typeof children === 'function' ? (
          children({ width: contentWidth, height: contentHeight })
        ) : (
          children
        )}
      </Content>
      { hasFooter && (
        <Footer>
          { footerCenterContent && (
            <CenterContentContainer>
              <CenterContainer>
                { footerCenterContent }
              </CenterContainer>
            </CenterContentContainer>
          )}
          { footerLeftContent && (
            <LeftContainer>
              { footerLeftContent }
            </LeftContainer>
          )}
          { footerRightContent && (
            <RightContainer>
              { footerRightContent }
            </RightContainer>
          )}
        </Footer>
      )}
      { hasHeader && (
        <Header>
          { headerCenterContent && (
            <CenterContentContainer>
              <CenterContainer>
                { headerCenterContent }
              </CenterContainer>
            </CenterContentContainer>
          )}
          { headerLeftContent && (
            <LeftContainer>
              { headerLeftContent }
            </LeftContainer>
          )}
          { headerRightContent && (
            <RightContainer>
              { headerRightContent }
            </RightContainer>
          )}
        </Header>
      )}
    </Container>
  )
}

export default Panel;