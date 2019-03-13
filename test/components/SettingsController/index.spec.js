import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { ThemeProvider } from 'styled-components';
import { I18nextProvider } from 'react-i18next';
import { configureStore, history } from '../../../app/store/configureStore';
import theme from '../../../app/styles/theme';
import i18n from '../../config/i18nForTests';
import SettingsController from '../../../app/components/SettingsController';
import Button from '../../../app/components/Button';

Enzyme.configure({ adapter: new Adapter() });

function setup(props) {
  const store = configureStore();
  const provider = (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ConnectedRouter history={history}>
          <I18nextProvider i18n={i18n}>
            <SettingsController {...props} />
          </I18nextProvider>
        </ConnectedRouter>
      </ThemeProvider>
    </Provider>
  );
  return mount(provider);
}

describe('<SettingsController />', () => {
  it('renders both of setting and logout', () => {
    const wrapper = setup({ onlySettings: false });
    expect(wrapper.find(Button)).toHaveLength(2);
  });

  it('renders only the setting button', () => {
    const wrapper = setup({ onlySettings: true });
    expect(wrapper.find(Button)).toHaveLength(1);
  });
});
