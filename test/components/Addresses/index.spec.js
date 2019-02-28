import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { ThemeProvider } from 'styled-components';
import { I18nextProvider } from 'react-i18next';
import { configureStore, history } from '../../../app/store/configureStore';
import theme from '../../../app/styles/theme';
import Addresses from '../../../app/components/Addresses';
import AddressBlock from '../../../app/components/AddressBlock';
import i18n from '../../config/i18nForTests';

import 'jest-styled-components';

Enzyme.configure({ adapter: new Adapter() });

function setup(props) {
  const store = configureStore();
  const provider = (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ConnectedRouter history={history}>
          <I18nextProvider i18n={i18n}>
            <Addresses {...props} />
          </I18nextProvider>
        </ConnectedRouter>
      </ThemeProvider>
    </Provider>
  );
  return mount(provider);
}

describe('<Addresses />', () => {
  it('Render Addresses', () => {
    const wrapper = setup({
      history: {},
      selectedAccountHash: 'tz1WAUJCqjTKsJ9D729t1DqXnPdATrYFCmwT',
      selectedParentHash: 'tz1WAUJCqjTKsJ9D729t1DqXnPdATrYFCmwT'
    });
    expect(wrapper.find(AddressBlock)).toHaveLength(0);
  });
});
