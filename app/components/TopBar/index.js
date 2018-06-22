/* eslint flowtype-errors/show-errors: 0 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components';
import { getWalletName } from '../../reducers/walletInitialization.duck'
import SettingsController from '../SettingsController';
import TotalBalance from '../TotalBalance';
import TezosLogo from '../TezosLogo';
import { ms } from '../../styles/helpers';

const Contaier = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 40px;
  flex-shrink: 0;
  background-color: ${ ({ theme: { colors } }) => colors.gray4 };
`;

const InfoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Text = styled.span`
  font-size: ${ms(2)};
  font-family: ${({ theme }) => theme.typo.fontFamily.primary};
  color: ${({ theme: { colors } }) => colors.primary};
  padding-left: ${ms(2)};
  letter-spacing: 0.9px;
`;

type Props = {
  walletName: string
}

class TopBar extends Component {
  render () {
    return (
      <Contaier>
      {this.props.location.pathname === '/' ? (
      <TezosLogo />
      ) : (
        <Fragment>
          <InfoContainer>
            <TezosLogo />
            <Text>{this.props.walletName}</Text>
            <TotalBalance />
          </InfoContainer>,
          <SettingsController />
        </Fragment>
      )}
    </Contaier>
    )

  }
  };

TopBar.defaultProps = {
  walletName: 'Wallet'
}

const mapStateToProps = state => {
  return {
    walletName: getWalletName(state)
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, null)
)(TopBar);

