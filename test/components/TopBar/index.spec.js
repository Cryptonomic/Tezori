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
import TopBar from '../../../app/components/TopBar';
import Button from '../../../app/components/Button';
import Logo from '../../../app/components/Logo';

Enzyme.configure({ adapter: new Adapter() });

function setup(props) {
  const store = configureStore();
  const provider = (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ConnectedRouter history={history}>
          <I18nextProvider i18n={i18n}>
            <TopBar {...props} />
          </I18nextProvider>
        </ConnectedRouter>
      </ThemeProvider>
    </Provider>
  );
  return mount(provider);
}

describe('<TopBar />', () => {
  it('Both of setting and logout should be exist', () => {
    const wrapper = setup({ onlyLogo: false });
    expect(wrapper.find(Button)).toHaveLength(2);
    expect(wrapper.find(Logo)).toHaveLength(1);
  });
  it('Only settings should be exist', () => {
    const wrapper = setup({ onlyLogo: true });
    expect(wrapper.find(Button)).toHaveLength(1);
  });
});
