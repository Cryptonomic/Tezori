/* eslint flowtype-errors/show-errors: 0 */
import React, { Component, Fragment } from 'react';
import { isNil } from 'lodash';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { lighten } from 'polished';
import { getWalletName } from '../../reducers/walletInitialization.duck';
import SettingsController from '../SettingsController';
import TotalBalance from '../TotalBalance';
import TezosLogo from '../TezosLogo';
import { ms } from '../../styles/helpers';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${ms(0)} ${ms(3)};
  flex-shrink: 0;
  background-color: ${({ isHomePath, theme: { colors } }) =>
    isHomePath ? colors.gray2 : lighten(0.03, colors.gray2)};
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
  walletName: string
};

class TopBar extends Component {
  render() {
    const isHomePath = this.props.location.pathname === '/';

    return (
      <Container isHomePath={isHomePath}>
        {isHomePath ? (
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
      </Container>
    );
  }
}

TopBar.defaultProps = {
  walletName: 'Wallet'
};

const mapStateToProps = state => {
  return {
    walletName: getWalletName(state)
  };
};

export default compose(withRouter, connect(mapStateToProps, null))(TopBar);
