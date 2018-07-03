// @flow
import React from 'react';
import RCTooltip from 'rc-tooltip';

import styled from 'styled-components';
import {stripUnit, lighten} from 'polished';
import { ms } from '../../styles/helpers';

type Props = {
  content: any,
  trigger: Array<string>
};

const TooltipAdapter = ({className, ...props}) => {
  return <RCTooltip {...props}
                    overlayClassName={`${className}__overlay`}
                    prefixCls={`${className}__tooltip`}
                    align={{ offset: "-22%" }} />
}

const arrowWidth = '10px';
const tooltipDistance = '14px';
const tooltipDistanceUnitless= stripUnit(tooltipDistance);
const arrowWidthUnitless = stripUnit(arrowWidth)

const StyledTooltip = styled(TooltipAdapter)`
  cursor: pointer;
  -webkit-app-region: no-drag;
  display: flex !important;
  align-items: center;

  &__tooltip {
    position: absolute;
    z-index: 9999;
    display: block;
    visibility: visible;
    font-size: ${ms(1)};
    opacity: 1;

    &-hidden {
      display: none;
    }

    &-placement-top, &-placement-topLeft, &-placement-topRight {
      padding: ${arrowWidth} 0 ${tooltipDistance} 0;
    }
    &-placement-right, &-placement-rightTop, &-placement-rightBottom {
      padding: 0 ${arrowWidth} 0 ${tooltipDistance};
    }
    &-placement-bottom, &-placement-bottomLeft, &-placement-bottomRight {
      padding: ${tooltipDistance} 0 ${arrowWidthUnitless / 2}px 0;
    }
    &-placement-left, &-placement-leftTop, &-placement-leftBottom {
      padding: 0 ${tooltipDistance} 0 ${arrowWidth};
    }


    &-inner {
      padding: ${ms(-2)};
      color: ${({theme: {colors}}) => colors.primary};
      text-align: left;
      text-decoration: none;
      background-color: ${({theme: {colors}}) => colors.white};
      border: 1px solid ${({theme: {colors}}) => lighten(0.1, colors.secondary)};
      -webkit-app-region: no-drag;
    }

    &-arrow {
      width: 0;
      height: 0;
      position: absolute;
      
      &::after {
        content: '';
        display: block;
        position: absolute;
        z-index: -1;
      }
    }

    &-placement-top &-arrow,
    &-placement-topLeft &-arrow,
    &-placement-topRight &-arrow {
      bottom: ${arrowWidthUnitless - 5}px;
      margin-left: -${arrowWidth};
      border-left: ${arrowWidthUnitless + 7}px solid transparent;
      border-right: ${arrowWidthUnitless + 7}px solid transparent;
      border-top: ${arrowWidth} solid ${({theme: {colors}}) => colors.white};
      
      &::after {
        border-left: ${arrowWidthUnitless + 7}px solid transparent;
        border-right: ${arrowWidthUnitless + 7}px solid transparent;
        border-top: ${arrowWidth} solid ${({theme: {colors}}) => colors.secondary};
        bottom: -1px;
        right: -${arrowWidthUnitless + 7}px;
        margin-left: -${arrowWidth};
      }
    }

    &-placement-top &-arrow {
      left: 50%;
    }

    &-placement-topLeft &-arrow {
      left: 15%;
    }

    &-placement-topRight &-arrow {
      right: 15%;
    }

    &-placement-right &-arrow,
    &-placement-rightTop &-arrow,
    &-placement-rightBottom &-arrow {
      left: ${tooltipDistanceUnitless - arrowWidthUnitless + 1}px;
      margin-top: -${arrowWidthUnitless + 7}px;
      border-top: ${(arrowWidthUnitless + 7)}px solid transparent;
      border-bottom: ${(arrowWidthUnitless + 7)}px solid transparent; 
      border-right: ${(arrowWidth)} solid ${({theme: {colors}}) => colors.white}; 
      
      &::after {
        border-top: ${(arrowWidthUnitless + 7)}px solid transparent;
        border-bottom: ${(arrowWidthUnitless + 7)}px solid transparent; 
        border-right: ${(arrowWidth)} solid ${({theme: {colors}}) => colors.secondary}; 
        left: -1px;
        bottom: -${arrowWidthUnitless + 7}px;
      }
    }

    &-placement-right &-arrow {
      top: 50%;
    }

    &-placement-rightTop &-arrow {
      top: 15%;
      margin-top: 0;
    }

    &-placement-rightBottom &-arrow {
      bottom: 15%;
    }

    &-placement-left &-arrow,
    &-placement-leftTop &-arrow,
    &-placement-leftBottom &-arrow {
      right: ${tooltipDistanceUnitless - arrowWidthUnitless + 1}px;
      margin-top: -${arrowWidthUnitless + 7}px;
      border-top: ${(arrowWidthUnitless + 7)}px solid transparent;
      border-bottom: ${(arrowWidthUnitless + 7)}px solid transparent;
      border-left: ${(arrowWidthUnitless)}px solid ${({theme: {colors}}) => colors.white};
      
      &::after {
        border-top: ${(arrowWidthUnitless + 7)}px solid transparent;
        border-bottom: ${(arrowWidthUnitless + 7)}px solid transparent;
        border-left: ${(arrowWidthUnitless)}px solid ${({theme: {colors}}) => colors.secondary};
        right: -1px;
        bottom: -${arrowWidthUnitless + 7}px;
      }
    }

    &-placement-left &-arrow {
      top: 50%;
    }

    &-placement-leftTop &-arrow {
      top: 15%;
      margin-top: 0;
    }

    &-placement-leftBottom &-arrow {
      bottom: 15%;
    }

    &-placement-bottom &-arrow,
    &-placement-bottomLeft &-arrow,
    &-placement-bottomRight &-arrow {
      top: ${tooltipDistanceUnitless - arrowWidthUnitless + 1}px;
      margin-left: -${arrowWidth};
      border-left: ${arrowWidthUnitless + 7}px solid transparent;
      border-right: ${arrowWidthUnitless + 7}px solid transparent;
      border-bottom: ${arrowWidth} solid ${({theme: {colors}}) => colors.white};
      
       &::after {
        border-left: ${arrowWidthUnitless + 7}px solid transparent;
        border-right: ${arrowWidthUnitless + 7}px solid transparent;
        border-bottom: ${arrowWidth} solid ${({theme: {colors}}) => colors.secondary};
        right: -${arrowWidthUnitless + 7}px;
        bottom: -${arrowWidthUnitless - 1}px;
      }
    }

    &-placement-bottom &-arrow {
      left: ${props => (props.arrowPos && props.arrowPos.left? props.arrowPos.left: '70%')};
    }

    &-placement-bottomLeft &-arrow {
      left: 2%;
    }

    &-placement-bottomRight &-arrow {
      right: 2%;
    }
  }
`;

function Tooltip(props: Props) {
  const { children, className, content, position, arrowPos, ...restOfProps } = props;
  return (
    <StyledTooltip placement={position} className={className} overlay={content} arrowPos={arrowPos} {...restOfProps}>
      {children}
    </StyledTooltip>
  );
}

Tooltip.defaultProps = {
  trigger: ['hover']
};

export default Tooltip;
