import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { ThemeProvider } from 'styled-components';
import { I18nextProvider } from 'react-i18next';
import theme from '../../../app/styles/theme';
import Transactions from '../../../app/components/Transactions';
import Transaction from '../../../app/components/Transaction/';
import i18n from '../../config/i18nForTests';

import mockIdentity from '../../config/mockData';

Enzyme.configure({ adapter: new Adapter() });

function setup(props) {
  const provider = (
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={i18n}>
        <Transactions {...props} />
      </I18nextProvider>
    </ThemeProvider>
  );
  return mount(provider);
}

describe('<Transactions />', () => {
  it('shoud render Transactions', () => {
    const wrapper = setup({
      transactions: mockIdentity.transactions,
      selectedAccountHash: 'tz1WAUJCqjTKsJ9D729t1DqXnPdATrYFCmwT',
      selectedParentHash: 'tz1WAUJCqjTKsJ9D729t1DqXnPdATrYFCmwT'
    });
    expect(wrapper.find(Transaction)).toHaveLength(
      mockIdentity.transactions.length
    );
  });
});
