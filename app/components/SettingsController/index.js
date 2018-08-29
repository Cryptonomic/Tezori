// @flow
import React, { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import styled from 'styled-components';

import TezosIcon from '../TezosIcon/';
import Button from '../Button/';
import { wrapComponent } from '../../utils/i18n';
import { goHomeAndClearState } from '../../reduxContent/wallet/thunks';
import { ms } from '../../styles/helpers';

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const ButtonContainer = styled(Button)`
  text-align: center;
  width: 67px;
  color: ${({ theme: { colors } }) => colors.primary};
  opacity: 0.6;
`;

const ButtonText = styled.div`
  font-size: 10px;
  font-weight: bold;
  letter-spacing: 0.4px;
  line-height: 28px;
`;
const Icon = styled(TezosIcon)`
  cursor: pointer;
`;

const Separator = styled.div`
  border-right: 2px solid #a8b6d5;
  margin-top: -11px;
  height: 40px;
`;

type Props = {
  goHomeAndClearState: () => {},
  goSettings: () => {},
  t: () => {}
};

class SettingsController extends Component<Props> {
  render() {
    const { goHomeAndClearState, goSettings, t } = this.props;
    return (
      <Container>
        <ButtonContainer onClick={goSettings} buttonTheme="plain">
          <Icon size={ms(2.2)} color="primary" iconName='settings' />
          <ButtonText>{t('components.settingController.settings')}</ButtonText>
        </ButtonContainer>
        <Separator />
        <ButtonContainer onClick={goHomeAndClearState} buttonTheme="plain">
          <Icon size={ms(2.2)} color="primary" iconName='logout' />
          <ButtonText>{t('components.settingController.logout')}</ButtonText>
        </ButtonContainer>
      </Container>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      goHomeAndClearState,
      goSettings: () => dispatch => dispatch(push('/home/settings'))
    },
    dispatch
  );
}

export default compose(wrapComponent, connect(null, mapDispatchToProps))(SettingsController);
