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
                    arrowContent={<div className={`${className}__tooltip-arrow`} />}/>
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
    z-index: 1070;
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
      padding: ${tooltipDistance} 0 ${arrowWidth} 0;
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
      position: absolute;
      width: 0;
      height: 0;
    }

    &-placement-top &-arrow,
    &-placement-topLeft &-arrow,
    &-placement-topRight &-arrow {
      bottom: ${arrowWidthUnitless - arrowWidthUnitless}px;
      margin-left: -${arrowWidth};
      border-left: 20px solid transparent;
      border-right: 20px solid transparent;
      border-top: 20px solid ${({theme: {colors}}) => colors.white};
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
      left: ${tooltipDistanceUnitless - arrowWidthUnitless}px;
      margin-top: -${arrowWidth};
      border-width: ${arrowWidth} ${arrowWidth} ${arrowWidth} 0;
      border-right-color: ${({theme: {colors}}) => colors.white};
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
      right: ${tooltipDistanceUnitless - arrowWidthUnitless}px;
      margin-top: -${arrowWidth};
      border-top: ${arrowWidthUnitless}px solid transparent;
      border-bottom: ${arrowWidthUnitless}px solid transparent;
      border-left: ${arrowWidthUnitless}px solid ${({theme: {colors}}) => colors.white};
      
      &::after {
        content: '';
        border-top: ${arrowWidthUnitless}px solid transparent;
        border-bottom: ${arrowWidthUnitless}px solid transparent;
        border-left: ${arrowWidthUnitless}px solid ${({theme: {colors}}) => colors.secondary};
        display: block;
        position: absolute;
        right: -${(arrowWidthUnitless - 8) / 2}px;
        bottom: -${arrowWidth};
        z-index: -1;
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
      top: ${tooltipDistanceUnitless - arrowWidthUnitless}px;
      margin-left: -${arrowWidth};
      border-left: ${arrowWidthUnitless + 7}px solid transparent;
      border-right: ${arrowWidthUnitless + 7}px solid transparent;
      border-bottom: ${arrowWidth} solid ${({theme: {colors}}) => colors.white};
      
       &::after {
        content: '';
        border-left: ${arrowWidthUnitless + 7}px solid transparent;
        border-right: ${arrowWidthUnitless + 7}px solid transparent;
        border-bottom: ${arrowWidth} solid ${({theme: {colors}}) => colors.secondary};
        display: block;
        position: absolute;
        right: -${arrowWidthUnitless + 7}px;
        bottom: -${arrowWidthUnitless - 1}px;
        z-index: -1;
      }
    }

    &-placement-bottom &-arrow {
      left: 50%;
    }

    &-placement-bottomLeft &-arrow {
      left: 15%;
    }

    &-placement-bottomRight &-arrow {
      right: 15%;
    }
  }
`;

function Tooltip(props: Props) {
  const { children, className, content, position, ...restOfProps } = props;
  return (
    <StyledTooltip placement={position} className={className} overlay={content} {...restOfProps}>
      {children}
    </StyledTooltip>
  );
}

Tooltip.defaultProps = {
  trigger: ['hover']
};

export default Tooltip;
