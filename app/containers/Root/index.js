// @flow
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { ThemeProvider } from 'styled-components';
import Theme from '../../styles/theme';
import Routes from '../../routes';

type Props = {
  store: {},
  history: {}
};

export default class Root extends Component<Props> {
  render() {
    return (
      <Provider store={this.props.store}>
        <ThemeProvider theme={Theme}>
          <ConnectedRouter history={this.props.history}>
            <Routes store={this.props.store} />
          </ConnectedRouter>
        </ThemeProvider>
      </Provider>
    );
  }
}
