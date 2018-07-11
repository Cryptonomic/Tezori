// @flow

import React, { Component } from 'react';
import styled, { withTheme } from 'styled-components';
import { darken } from 'polished';
import { ms } from '../../styles/helpers';
import transactionsEmptyState from '../../../resources/transactionsEmptyState.svg'
import LoaderSpinner from '../LoaderSpinner/';
import { H4 } from '../Heading/';

import * as statuses from '../../constants/StatusTypes';
import { MNEMONIC } from '../../constants/StoreTypes';
import { formatAmount } from '../../utils/currancy';
import Info from './Info';

const Container = styled.section`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  align-self: center;
  width: 400px;
  padding-top: ${ms(5)};
  text-align: center;
`;

const Image = styled.img`(
  display: inline-block;
  padding-bottom: ${ms(4)};
)`;

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

type Props = {
  address?: object
};

function AccountStatus(props: Props) {
  const { address, theme } = props;

  const storeTypes = address.get('storeTypes');
  const status = address.get('status');
  const operations = address.get('operations').toJS();

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
  switch( status ) {
    case statuses.CREATED:
      if ( storeTypes === MNEMONIC ) {
        icon = <Image alt={'Creating account'} src={transactionsEmptyState} />;
        title = 'Your account is currently not ready.';
        description = 'The first transaction will get your account ready to send and delegate. Getting your account ready after your first transaction might take a while.';
      } else {
        title = 'Retrieving your account...';
        if ( operations[ statuses.CREATED ] ) {
          info = (
            <Info
              firstIconName="icon-star"
              operationName="activation operation id"
              operationId={ operations[ statuses.CREATED ] }
              lastIconName="icon-new-window"
            />
          );
        }
      }
      break;
    case statuses.FOUND:
    case statuses.PENDING:
      title = 'Preparing your account...';
      const operationID = operations[ statuses.FOUND ] || operations[ statuses.PENDING ];
      if ( operationID ) {
        info = (
          <Info
            firstIconName="icon-broadcast"
            operationName="public key reveal operation id"
            operationId={ operationID }
            lastIconName="icon-new-window"
          />
        );
      }

      if ( storeTypes === MNEMONIC ) {
        const transaction = address.get('transactions').toJS();
        const { amount } = transaction[0];
        description = `We have received your first transaction of ${ formatAmount(amount, 2) } tez! Preparing your account now, this might take a while.`;
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