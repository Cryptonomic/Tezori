import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { ThemeProvider } from 'styled-components';
import { I18nextProvider } from 'react-i18next';
import { configureStore, history } from '../../../app/store/configureStore';
import theme from '../../../app/styles/theme';
import CreateAccountSlide from '../../../app/components/CreateAccountSlide';
import BackUpSeedPhrase from '../../../app/components/CreateAccountSlide/BackUpSeedPhrase';
import i18n from '../../config/i18nForTests';

Enzyme.configure({ adapter: new Adapter() });

function setup(props) {
  const store = configureStore();
  const provider = (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ConnectedRouter history={history}>
          <I18nextProvider i18n={i18n}>
            <CreateAccountSlide {...props} />
          </I18nextProvider>
        </ConnectedRouter>
      </ThemeProvider>
    </Provider>
  );
  return mount(provider);
}

describe('<CreateAccountSlide />', () => {
  it('Render SeedsContainer', () => {
    const wrapper = setup();
    expect(wrapper.find('SeedsContainer')).toHaveLength(1);
  });

  it('Render BackUpSeedPhrase', () => {
    const wrapper = setup();
    wrapper.find('ActionButton').simulate('click');
    expect(wrapper.find(BackUpSeedPhrase)).toHaveLength(1);
  });
});
