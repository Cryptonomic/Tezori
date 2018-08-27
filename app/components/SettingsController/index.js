// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import styled from 'styled-components';
import MenuItem from '@material-ui/core/MenuItem';
import i18n from 'i18next';

import localsMap from '../../constants/LocalsMap';
import Button from '../Button/';
import settingsIcon from '../../../resources/settings.png';
import logoutIcon from '../../../resources/logout.png';
import CustomSelect from '../../components/CustomSelect/';
import { goHomeAndClearState } from '../../reduxContent/wallet/thunks';
import { setLocal } from '../../reduxContent/settings/thunks';
import { getLocal } from '../../reduxContent/settings/selectors';

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

const ItemWrapper = styled(MenuItem)`
  &&& {
    &[class*='selected'] {    
      color: ${({ theme: { colors } }) => colors.primary };
    }
    width: 100%;
    font-size: 16px;
    font-weight: 300;
    background-color: ${({ type, theme: { colors } }) => type==="addmore"?colors.gray1: colors.white };
  }  
`;

type Props = {
  local: string,
  setLocal: () => {},
  goHomeAndClearState: () => {},
  goSettings: () => {}
};

class SettingsController extends Component<Props> {
  static renderOptions() {
    return Object.keys(localsMap).map((key) => {
      return (
        <ItemWrapper
          key={key}
          value={key}
        >
          <div> { localsMap[key] } </div>
        </ItemWrapper>
      );
    });
  }
  
  render() {
    const { goHomeAndClearState, goSettings, setLocal, local } = this.props;
    return (
      <Container>
        <CustomSelect
          label="Language"
          value={local}
          onChange={(event) => {
            const newValue = event.target.value;
            setLocal(newValue);
            i18n.changeLanguage(newValue);
          }}
        >
          {SettingsController.renderOptions()}
        </CustomSelect>
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

function mapStateToProps(state) {
  return {
    local: getLocal(state)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      goHomeAndClearState,
      setLocal,
      goSettings: () => dispatch => dispatch(push('/home/settings'))
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsController);
