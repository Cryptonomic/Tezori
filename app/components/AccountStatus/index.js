// @flow

import React, { Component } from 'react';
import styled, { withTheme } from 'styled-components';
import { darken } from 'polished';
import { ms } from '../../styles/helpers';
import transactionsEmptyState from '../../../resources/transactionsEmptyState.svg'
import LoaderSpinner from '../LoaderSpinner/';
import TezosIcon from '../TezosIcon/';
import { H4 } from '../Heading/';

import * as statuses from '../../constants/StatusTypes';
import { MNEMONIC } from '../../constants/StoreTypes';
import { limitLength } from '../../utils/strings';

const Container = styled.section`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  align-self: center;
  width: 400px;
  padding-top: ${ms(5)};
  text-align: center;
`

const Image = styled.img`(
  display: inline-block;
  padding-bottom: ${ms(4)};
)`

const Icon = styled.div`
  height:180px;
  width: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled(H4)`
  font-weight: normal;
`;

const Description = styled.div`
  font-weight: 300;
  color: #4a4a4a;
  font-size: ${ms(-0.5)}
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InfoIcon = styled(TezosIcon)`
  height: ${ms(1)};
  width: ${ms(1)};
`;

const ActivationOperation = styled.div`
  color: ${({ theme: { colors } }) => colors.accent };
  font-size: ${ms(-1)};
  margin-left: 5px;
  margin-right: 5px;
`;

const ActivationOperationId = styled.div`
  color: #4a4a4a;
  font-size: ${ms(-1)};
  margin-right: 10px;
`;

const Details = styled.div`
  color: ${({ theme: { colors } }) => colors.primary };
  font-size: ${ms(-1)};
  margin-right: 5px;
`;

type Props = {
  address?: object
};

function AccountStatus(props: Props) {
  const { address, theme } = props;

  const storeTypes = address.get('storeTypes');
  const status = address.get('status');
  const operations = address.get('operations');

  let icon = (
    <LoaderSpinner
      size="x4"
      styles={{
          color:  theme.colors.accent
        }}
    />
  );
  let title = '';
  let description = '';
  let info = null;
  //operation icon, operationName, operation id, details, icon
  switch( status ) {
    case statuses.CREATED:
      if ( storeTypes !== MNEMONIC ) {
        icon = <Image alt={'Creating account'} src={transactionsEmptyState} />;
        title = 'Your account is currently not ready.';
        description = 'The first transaction will get your account ready to send and delegate. Getting your account ready after your first transaction might take a while.';
      } else {
        if ( !operations[ statuses.CREATED ] ) {
          info = (
            <Info>
              <InfoIcon
                size={ ms(1) }
                color={ theme.colors.accent }
                iconName="icon-star"
              />
              <ActivationOperation>
                ACTIVATION OPERATION ID
              </ActivationOperation>
              <ActivationOperationId>
                { limitLength('operations[ statuses.CREATED ]', 17) }
              </ActivationOperationId>
              <Details>
                Details
              </Details>
              <InfoIcon
                size={ ms(1) }
                color={ theme.colors.primary }
                iconName="icon-new-window"
              />
            </Info>
          );
        }
        title = 'Retrieving your account...';
      }
      break;
    case statuses.FOUND:
    case statuses.PENDING:
      title = 'Preparing your account...';
      if ( storeTypes === MNEMONIC ) {
        description = 'We have received your first transaction of xxx tez! Preparing your account now, this might take a while.';
      }
      break;
  }

  return (
    <Container>
      <Icon>{ icon }</Icon>
      <Title>{ title }</Title>
      {
        description
          ? <Description>{ description }</Description>
          : null
      }
      { info }
    </Container>
  );
}

export default withTheme(AccountStatus);