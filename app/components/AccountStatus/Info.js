// @flow

import React, { Component } from 'react';
import styled, { withTheme } from 'styled-components';
import { darken } from 'polished';
import { ms } from '../../styles/helpers';
import TezosIcon from '../TezosIcon/';
import { H4 } from '../Heading/';

import { limitLength } from '../../utils/strings';
import { openLinkToBlockExplorer } from '../../utils/general';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${ms(-2)};
`;

const InfoIcon = styled(TezosIcon)`
  font-size: ${ms(-1)};
  cursor: pointer;
`;

const ActivationOperation = styled.div`
  color: ${({ theme: { colors } }) => colors.accent };
  text-transform: uppercase;
  margin-left: 5px;
  margin-right: 5px;
`;

const ActivationOperationId = styled.div`
  color: #4a4a4a;
  margin-right: 10px;
`;

const Details = styled.div`
  color: ${({ theme: { colors } }) => colors.primary };
  margin-right: 5px;
  cursor: pointer;
`;

type Props = {
  firstIconName?: string,
  operationName?: string,
  operationId?: string,
  lastIconName?: string
};

function Info(props: Props) {
  const { firstIconName, operationName, operationId, lastIconName } = props;

  return (
    <Container>
      <InfoIcon
        size={ ms(1) }
        color="accent"
        iconName={ firstIconName }
      />
      <ActivationOperation>
        { operationName }
      </ActivationOperation>
      <ActivationOperationId>
        { limitLength(operationId, 17) }
      </ActivationOperationId>
      <Details
        onClick={ () => {
          openLinkToBlockExplorer(operationId);
        }}
      >
        Details
      </Details>
      <InfoIcon
        size={ ms(1) }
        color="primary"
        iconName={ lastIconName }
        onClick={ () => {
          openLinkToBlockExplorer(operationId);
        }}
      />
    </Container>
  );
}

export default withTheme(Info);
