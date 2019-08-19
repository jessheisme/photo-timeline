import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { rgba } from 'polished';
import useMeasure from '../../hooks/useMeasure';
import useScroll from '../../hooks/useScroll';
import Icon from '../../components/Icon';
import { absoluteFill, alignCenter } from '../../mixins';
import { size, color, transition } from '../../theme';

const LIGHTBOX_MARGIN = size.XLARGE;

const Container = styled.div`
  ${absoluteFill()};
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
`

const ItemContainer = styled.div`
  position: absolute;
  left: 0px;
  top: 0px;
`

const BackgroundContainer = styled.div`
  ${absoluteFill()};
  background-color: ${color.white};
  z-index: 2;
`

const IconContainer = styled.div`
  position: relative;
  ${alignCenter()};
  transition: all ${transition};
`

const ArrowContainer = styled.div`
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: ${LIGHTBOX_MARGIN}px;
  background-color: ${color.gray100}
  ${alignCenter()};
  cursor: pointer;
  color: ${color.gray300};
  &:hover {
    ${IconContainer} {
      transform: scale(1.1);
      color: ${color.black};
    }
  }
`

const Grid = (props) => {
  const {
    id,
    windowSize,
    width,
    items,
    columns,
    children: renderItem,
    selectedItemId,
    onItemSelect,
  } = props;
  
  const itemWidth = Math.round(width / columns);
  const itemHeight = itemWidth;

  const [containerRef, containerRect] = useMeasure();
  const scroll = useScroll({ scrollRef: containerRef });

  const [initialLoad, setInitialLoad] = useState(true);
  const initialLoadTimeout = useRef(null);

  const itemKeys = useMemo(() => {
    return items.map(item => item.id);
  }, [items]);

  const selectNextItem = () => {
    const itemIndex = itemKeys.indexOf(selectedItemId);
    const nextIndex = itemIndex === itemKeys.length - 1 ? 0 : itemIndex + 1;
    const nextItemId = itemKeys[nextIndex];
    onItemSelect(nextItemId);
  }

  const selectPreviousItem = () => {
    const itemIndex = itemKeys.indexOf(selectedItemId);
    const previousIndex = itemIndex === 0 ? itemKeys.length - 1 : itemIndex - 1;
    const previousItemId = itemKeys[previousIndex];
    onItemSelect(previousItemId);
  }

  useEffect(() => {
    setInitialLoad(true);
    clearTimeout(initialLoadTimeout.current)
    initialLoadTimeout.current = setTimeout(() => {
      setInitialLoad(false);
    }, 1000)
  }, [id])

  return (
    <Container
      ref={containerRef}
    >
      { ReactDOM.createPortal(
        <BackgroundContainer
          style={{
            ...!selectedItemId && { pointerEvents: 'none' },
            opacity: selectedItemId ? 1 : 0,
          }}
        >
          <ArrowContainer
            onClick={selectPreviousItem}
            style={{
              left: 0,
            }}
          >
            <IconContainer>
              <Icon icon="chevron-left" size={size.XLARGE} />
            </IconContainer>
          </ArrowContainer>
          <ArrowContainer
            onClick={selectNextItem}
            style={{
              right: 0,
            }}
          >
            <IconContainer>
              <Icon icon="chevron-right" size={size.XLARGE} />
            </IconContainer>
          </ArrowContainer>
        </BackgroundContainer>
        ,
        document.body,
      )}
      { items.map((item, i) => {

        const x = (i % columns) * itemWidth;
        const yStagger = (i % columns) * (itemHeight / 2);
        const y = Math.floor((i / columns)) * itemHeight + yStagger;

        const isSelected = selectedItemId === item.id;

        const rect = isSelected
          ? {
            x: LIGHTBOX_MARGIN,
            y: LIGHTBOX_MARGIN,
            width: windowSize.width - (2 * LIGHTBOX_MARGIN),
            height: windowSize.height - (2 * LIGHTBOX_MARGIN),
            zIndex: 10,
          } : {
            x: containerRect.left + x,
            y: containerRect.top + y - scroll.scrollTop,
            width: itemWidth,
            height: itemHeight,
            zIndex: 1,
          }
          
        return (
          <React.Fragment key={item.id}>
            <ItemContainer
              onClick={() => onItemSelect(item.id)}
              key={item.id}
              style={{
                width: itemWidth,
                height: itemHeight,
                transform: `translate3d(${x}px, ${y}px, 0px)`,
              }}
            />
            { ReactDOM.createPortal(
              <ItemContainer
                onClick={() => onItemSelect(item.id)}
                key={item.id}
                style={{
                  width: rect.width,
                  height: rect.height,
                  transform: `translate3d(${rect.x}px, ${rect.y}px, 0px)`,
                  ...!isSelected && { pointerEvents: 'none' },
                  opacity: initialLoad ? 0 : 1,
                  zIndex: rect.zIndex,
                  transition: `opacity 0.4s ease-out`,
                  transitionDelay: `${i * 80}ms`,
                }}
              >
                { renderItem(item, { width: itemWidth, height: itemHeight }) }
              </ItemContainer>,
              document.body
            )}
          </React.Fragment>
        )
      })}
    </Container>
  )
}

export default Grid;