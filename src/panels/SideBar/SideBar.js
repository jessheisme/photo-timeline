import React from 'react';
import styled from 'styled-components';
import { rgba } from 'polished';
import { absoluteFill, alignCenter } from '../../mixins';
import { size, color, font, transition } from '../../theme';

const Container = styled.div`
  ${absoluteFill()}
  background-color: ${color.gray100};
  padding: ${size.LARGE}px;
`

const Header = styled.div`
  position: relative;
  ${font.HEADER_M(color.black)};
  margin-bottom: ${size.LARGE}px;
  user-select: none;
`

const HeaderTop = styled.div`
  position: relative;
  transition: all ${transition};
`
const HeaderBottom = styled.div`
  position: relative;
  color: ${color.gray300};
  transition: all ${transition};
`

const Content = styled.div`
  position: relative;
`

const CollectionItem = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  transition: all ${transition};
  margin-bottom: ${size.TINY}px;
`

const CollectionSelectContainer = styled.div`
  position: relative;
  width: ${size.LARGE}px;
  height: ${size.LARGE}px;
  ${alignCenter()}
`

const SelectDot = styled.div`
  position: relative;
  width: ${size.SMALL}px;
  height: ${size.SMALL}px;
  border-radius: 1000px;
  background-color: ${rgba(color.red, 0.4)};
  transition: all ${transition};
`

const CollectionTitle = styled.div`
  ${font.BODY_L(color.gray300)}
  ${p => p.isSelected && `color: ${rgba(color.red, 0.4)};`}
  transition: color ${transition};
  cursor: pointer;
  &:hover {
    ${p => !p.isSelected && `color: ${rgba(color.red, 0.2)};`}
  }
`

const Footer = styled.div`
  position: absolute;
  left: 0px;
  right: 0px;
  bottom: 0px;
  padding: ${size.LARGE}px;
`

const InstaLink = styled.a`
  ${font.BODY_M(color.gray300)};
  text-decoration: none;
  &:hover {
    color: ${rgba(color.red, 0.4)};
  }
`

const SideBar = (props) => {

  const {
    isLoaded,
    collections,
    selectedCollectionId,
    selectCollection,
  } = props;

  const initialDelay = 1000;
  const delayStep = 50;

  const headerTopDelay = initialDelay;
  const headerBottomDelay = headerTopDelay + delayStep;

  const initialItemDelay = headerBottomDelay + delayStep;

  return (
    <Container>
      <Header>
        <HeaderTop
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded
              ? 'translate3d(0px, 0px, 0px)'
              : 'translate3d(-20px, 0px, 0px)',
            transitionDelay: `${headerTopDelay}ms`,
          }}
        >
          LOVE
        </HeaderTop>
        <HeaderBottom
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded
              ? 'translate3d(0px, 0px, 0px)'
              : 'translate3d(-20px, 0px, 0px)',
            transitionDelay: `${headerBottomDelay}ms`,
          }}
        >
          EXPOSURE
        </HeaderBottom>
      </Header>  
      <Content>
        { collections.map((collection, i) => {
          const isSelected = selectedCollectionId === collection.id;
          const itemDelay = initialItemDelay + i * 50;
          return (
            <CollectionItem
              key={collection.id}
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded
                  ? 'translate3d(0px, 0px, 0px)'
                  : 'translate3d(-20px, 0px, 0px)',
                transitionDelay: `${itemDelay}ms`,
              }}
            >
              <CollectionSelectContainer>
                <SelectDot
                  style={{
                    opacity: isSelected ? 1 : 0,
                    transform: isSelected
                      ? 'scale(1)'
                      : 'translate3d(-20px, 0px, 0px) scale(0.4)',
                  }}
                />
              </CollectionSelectContainer>
              <CollectionTitle
                isSelected={isSelected}
                key={collection.id}
                onClick={() => selectCollection(collection.id)}
              >
                { collection.name }
              </CollectionTitle>
            </CollectionItem>
          );
        })}
      </Content>
      <Footer>
        <InstaLink target="_blank" href="https://www.instagram.com/_johntraver/">
          @_johntraver 2019
        </InstaLink>
      </Footer>
    </Container>
  )
}

export default SideBar;