// @flow
import React, { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import AddCircle from '@material-ui/icons/AddCircle';
import styled, { withTheme } from 'styled-components';
import { ms } from '../../styles/helpers';

import { H4 } from '../Heading/';
import AddressBlock from '../AddressBlock/';
import Tooltip from '../Tooltip/';
import { syncAccountOrIdentity } from '../../reduxContent/wallet/thunks';
import { sortArr } from '../../utils/array';
import { wrapComponent } from '../../utils/i18n';

type Account = {
  account_id: string,
  block_id: string,
  manager: string,
  spendable: boolean,
  delegate_setable: boolean,
  delegate_value: string,
  counter: number,
  script: string,
  balance: number
};

type Identity = {
  privateKey: string,
  publicKey: string,
  publicKeyHash: string,
  balance: number,
  accounts: List<Account>
};

const Container = styled.aside`
  width: 30%;
  max-width: 320px;
  flex-shrink: 0;
  padding: 0 ${ms(3)} 0 0;
`;

const AccountTitle = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme: { colors } }) => colors.secondary};
  margin: 0 0 ${ms(2)} 0;
`;

const AccountItem = styled.div`
  margin: 0 0 ${ms(1)} 0;
`;

const AccountsTooltip = styled.div`
  font-size: ${ms(-1)};
  max-width: ${ms(12)};
  color: ${({ theme: { colors } }) => colors.secondary};
`;

type Props = {
  identities: List<Identity>,
  syncAccountOrIdentity: () => {},
  selectedAccountHash: string,
  theme: object,
  history: object,
  selectedParentHash: string,
  t: () => {}
};

class Addresses extends Component<Props> {
  props: Props;

  render() {
    const {
      history,
      syncAccountOrIdentity,
      selectedAccountHash,
      selectedParentHash,
      identities,
      theme: { colors },
      t
    } = this.props;
    return (
      <Container>
        <AccountTitle>
          <H4>{t('general.nouns.accounts')}</H4>
          <Tooltip
            position="bottom"
            content={
              <AccountsTooltip>
                {t('components.addresses.support_tooltip')}
              </AccountsTooltip>
            }
          >
            <AddCircle
              disabled
              style={{
                fill: colors.secondary,
                opacity: 0.5,
                width: ms(3),
                height: ms(3),
                cursor: 'default'
              }}
            />
          </Tooltip>
        </AccountTitle>
        {identities
          .sort(sortArr({ sortOrder: 'asc', sortBy: 'order' }))
          .map((accountBlock, index) => (
            <AccountItem key={accountBlock.get('publicKeyHash')}>
              <AddressBlock
                accountBlock={accountBlock}
                accountIndex={index + 1}
                syncAccountOrIdentity={syncAccountOrIdentity}
                selectedAccountHash={selectedAccountHash}
                selectedParentHash={selectedParentHash}
                history={history}
              />
            </AccountItem>
          ))}
      </Container>
    );
  }
}

function mapStateToProps(state) {
  const { wallet } = state;

  return {
    identities: wallet.get('identities')
  };
}

function mapDispatchToProps(dispatch: () => {}) {
  return bindActionCreators(
    {
      syncAccountOrIdentity
    },
    dispatch
  );
}

export default compose(
  withTheme,
  wrapComponent,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Addresses);
