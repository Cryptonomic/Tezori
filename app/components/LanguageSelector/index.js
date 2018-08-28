// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import i18n from 'i18next';
import MenuItem from '@material-ui/core/MenuItem';

import localesMap from '../../constants/LocalesMap';
import CustomSelect from '../../components/CustomSelect/';
import { setLocal } from '../../reduxContent/settings/thunks';
import { getLocal } from '../../reduxContent/settings/selectors';

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

const Container = styled.div`
  margin-top: 25px;
`;

type Props = {
  local: string,
  setLocal: () => {}
};

class LanguageSelector extends Component<Props> {
  static renderOptions() {
    return Object.keys(localesMap).map((key) => {
      return (
        <ItemWrapper
          key={key}
          value={key}
        >
          <div> { localesMap[key] } </div>
        </ItemWrapper>
      );
    });
  }

  render() {
    const { setLocal, local } = this.props;
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
          {LanguageSelector.renderOptions()}
        </CustomSelect>
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
      setLocal
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(LanguageSelector);
