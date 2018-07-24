// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import styled from 'styled-components';

import Button from '../Button/';
import settingsIcon from '../../../resources/settings.png';
import logoutIcon from '../../../resources/logout.png';
import { goHomeAndClearState } from '../../reduxContent/wallet/thunks';

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const Icon = styled.img`
  cursor: pointer;
`;

const SettingsIcon = styled(Icon)`
  height: 80px;
`;

const LogoutIcon = styled(Icon)`
  height: 65px;
`;

const Separator = styled.div`
  border-right: 2px solid #a8b6d5;
  margin-right: 8px;
  height: 50px;
`;

type Props = {
  goHomeAndClearState: Function,
  goSettings: Function
};

class SettingsController extends Component<Props> {
  render() {
    const { goHomeAndClearState, goSettings } = this.props;
    return (
      <Container>
        <Button onClick={goSettings} buttonTheme="plain">
          <SettingsIcon alt="Settings" src={settingsIcon} />
        </Button>
        <Separator />
        <Button onClick={goHomeAndClearState} buttonTheme="plain">
          <LogoutIcon alt="Logout" src={logoutIcon} />
        </Button>
      </Container>
    );
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      goHomeAndClearState,
      goSettings: () => dispatch => dispatch(push('/home/settings'))
    },
    dispatch
  );

export default connect(null, mapDispatchToProps)(SettingsController);
