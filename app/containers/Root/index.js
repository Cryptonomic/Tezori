// @flow
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { ThemeProvider } from 'styled-components';
import { I18nextProvider } from 'react-i18next';

import theme from '../../styles/theme';
import Routes from '../../routes';
import { createIl8nInstance } from '../../utils/i18n';
import { getLocal } from '../../reduxContent/settings/selectors';

type Props = {
  store: {},
  history: {}
};

class Root extends Component<Props> {
  render() {
    const { store } = this.props;
    const state = store.getState();
    return (
      <Provider store={this.props.store}>
        <ThemeProvider theme={theme}>
          <ConnectedRouter history={this.props.history}>
            <I18nextProvider i18n={createIl8nInstance(getLocal(state))}>
              <Routes store={this.props.store} />
            </I18nextProvider>
          </ConnectedRouter>
        </ThemeProvider>
      </Provider>
    );
  }
}

export default Root;
