import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { ThemeProvider } from 'styled-components';
import { I18nextProvider } from 'react-i18next';
import { fromJS } from 'immutable';
import AddCircle from '@material-ui/icons/AddCircle';
import { configureStore, history } from '../../../app/store/configureStore';
import theme from '../../../app/styles/theme';
import AddressBlock from '../../../app/components/AddressBlock';
import Address from '../../../app/components/Address';
import AddressStatus from '../../../app/components/AddressStatus';
import i18n from '../../config/i18nForTests';
import mockIdentity from '../../config/mockData';

import 'jest-styled-components';

Enzyme.configure({ adapter: new Adapter() });

function setup(props) {
  const store = configureStore();
  const provider = (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ConnectedRouter history={history}>
          <I18nextProvider i18n={i18n}>
            <AddressBlock {...props} />
          </I18nextProvider>
        </ConnectedRouter>
      </ThemeProvider>
    </Provider>
  );
  return mount(provider);
}

describe('<AddressBlock />', () => {
  it('Should be ready', () => {
    const wrapper = setup({
      hideDelegateTooltip: () => {},
      delegateTooltip: true,
      history: {},
      accountBlock: fromJS({ ...mockIdentity, accounts: [] }),
      syncAccountOrIdentity: () => {},
      selectedAccountHash: 'tz1WAUJCqjTKsJ9D729t1DqXnPdATrYFCmwT',
      accountIndex: 0
    });
    expect(wrapper.find(Address)).toHaveLength(1);
  });

  it('Should render AddressStatus', () => {
    const wrapper = setup({
      hideDelegateTooltip: () => {},
      delegateTooltip: true,
      history: {},
      accountBlock: fromJS({
        ...mockIdentity,
        accounts: [],
        status: 'created'
      }),
      syncAccountOrIdentity: () => {},
      selectedAccountHash: 'tz1WAUJCqjTKsJ9D729t1DqXnPdATrYFCmwT',
      accountIndex: 0
    });
    expect(wrapper.find(AddressStatus)).toHaveLength(1);
  });

  it('Should not render AddDelegateModal', () => {
    const wrapper = setup({
      hideDelegateTooltip: () => {},
      delegateTooltip: true,
      history: {},
      accountBlock: fromJS({ ...mockIdentity, accounts: [] }),
      syncAccountOrIdentity: () => {},
      selectedAccountHash: 'tz1WAUJCqjTKsJ9D729t1DqXnPdATrYFCmwT',
      accountIndex: 0
    });
    expect(wrapper.find('ModalTitle')).toHaveLength(0);
  });

  it('Should render AddDelegateModal', () => {
    const wrapper = setup({
      hideDelegateTooltip: () => {},
      delegateTooltip: true,
      history: {},
      accountBlock: fromJS({ ...mockIdentity, accounts: [] }),
      syncAccountOrIdentity: () => {},
      selectedAccountHash: 'tz1WAUJCqjTKsJ9D729t1DqXnPdATrYFCmwT',
      accountIndex: 0
    });
    wrapper.find(AddCircle).simulate('click');
    expect(wrapper.find('ModalTitle')).toHaveLength(1);
  });
});
