/* eslint flowtype-errors/show-errors: 0 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import {
  getWalletName,
  getIsLedger
} from '../../reduxContent/wallet/selectors';
import SettingsController from '../SettingsController/';
import { ms } from '../../styles/helpers';
import Logo from './../Logo';
import { wrapComponent } from '../../utils/i18n';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${ms(0)} ${ms(3)};
  flex-shrink: 0;
`;

const InfoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Text = styled.span`
  font-size: ${ms(2)};
  font-family: ${({ theme }) => theme.typo.fontFamily.primary};
  font-weight: ${({ theme }) => theme.typo.weights.light};
  color: ${({ theme: { colors } }) => colors.primary};
  padding: 0 ${ms(2)};
  border-right: 1px solid ${({ theme: { colors } }) => colors.gray2};
  letter-spacing: 0.9px;
`;

type Props = {
  onlyLogo: boolean | void,
  walletName: string,
  isLedger: boolean,
  t: () => {}
};

class TopBar extends Component<Props> {
  render() {
    const { onlyLogo, walletName, isLedger, t } = this.props;
    const displayWalletName = isLedger
      ? t('general.nouns.ledger_name')
      : walletName;

    return (
      <Container onlyLogo={onlyLogo}>
        <InfoContainer>
          <Logo />
          <Text>{displayWalletName}</Text>
        </InfoContainer>
        <SettingsController onlySettings={onlyLogo} />
      </Container>
    );
  }
}

TopBar.defaultProps = {
  walletName: 'Wallet'
};

const mapStateToProps = state => {
  return {
    walletName: getWalletName(state),
    isLedger: getIsLedger(state)
  };
};

export default compose(
  withRouter,
  wrapComponent,
  connect(
    mapStateToProps,
    null
  )
)(TopBar);
