// @flow
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { ThemeProvider } from 'styled-components';

import theme from '../../styles/theme';
import Routes from '../../routes';

type Props = {
  store: {},
  history: {}
};

class Root extends Component<Props> {
  render() {
    return (
      <Provider store={this.props.store}>
        <ThemeProvider theme={theme}>
          <ConnectedRouter history={this.props.history}>
            <Routes store={this.props.store} />
          </ConnectedRouter>
        </ThemeProvider>
      </Provider>
    );
  }
}

export default Root;
