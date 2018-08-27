import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { I18nextProvider } from 'react-i18next';
import Root from './containers/Root/';
import { configureStore, history } from './store/configureStore';
import muiTheme from './muiTheme';
import './styles/global-styles';
import { instance } from './utils/i18n';

const store = configureStore();

render(
  <I18nextProvider i18n={instance}>
    <MuiThemeProvider theme={muiTheme}>
      <AppContainer>
        <Root store={store} history={history} />
      </AppContainer>
    </MuiThemeProvider>
  </I18nextProvider>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    const NextRoot = require('./containers/Root'); // eslint-disable-line global-require
    render(
      <I18nextProvider i18n={instance}>
        <MuiThemeProvider muiTheme={muiTheme}>
          <AppContainer>
            <NextRoot store={store} history={history} />
          </AppContainer>
        </MuiThemeProvider>
      </I18nextProvider>,
      document.getElementById('root')
    );
  });
}
