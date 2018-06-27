// @flow
import React from 'react';
import { Tooltip as ReactTippy } from 'react-tippy';

import styled from 'styled-components';
import { ms } from '../../styles/helpers';

type Props = {};

const StyledTooltip = styled(ReactTippy)`
  cursor: pointer;
  -webkit-app-region: no-drag;
  display: flex !important;
  align-items: center;
`;

function Tooltip(props: Props) {
  const { children, className, content, ...restOfProps } = props;

  return (
    <StyledTooltip className={className} html={content} {...restOfProps}>
      {children}
    </StyledTooltip>
  );
}

Tooltip.defaultProps = {
  theme: 'tezos',
  arrow: true,
  arrowSize: 'regular',
  distance: 20
};

export default Tooltip;
