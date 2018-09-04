// @flow
import React, { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import i18n from 'i18next';
import MenuItem from '@material-ui/core/MenuItem';

import { wrapComponent } from '../../utils/i18n';
import localesMap from '../../constants/LocalesMap';
import CustomSelect from '../../components/CustomSelect/';
import { setLocale } from '../../reduxContent/settings/thunks';
import { getLocale } from '../../reduxContent/settings/selectors';

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
`;

type Props = {
  t: () => {},
  locale: string,
  setLocale: () => {}
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
    const { setLocale, locale, t } = this.props;
    return (
      <Container>
        <CustomSelect
          label={t('general.nouns.language')}
          value={locale}
          onChange={(event) => {
            const newValue = event.target.value;
            setLocale(newValue);
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
    locale: getLocale(state)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setLocale
    },
    dispatch
  );
}

export default compose(wrapComponent, connect(mapStateToProps, mapDispatchToProps))(
  LanguageSelector
);
