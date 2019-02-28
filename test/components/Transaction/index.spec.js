import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { ThemeProvider } from 'styled-components';
import { I18nextProvider } from 'react-i18next';
import theme from '../../../app/styles/theme';
import Transaction from '../../../app/components/Transaction';
import TezosAddress from '../../../app/components/TezosAddress';
import i18n from '../../config/i18nForTests';

Enzyme.configure({ adapter: new Adapter() });

function setup(props) {
  const provider = (
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={i18n}>
        <Transaction {...props} />
      </I18nextProvider>
    </ThemeProvider>
  );
  return mount(provider);
}

describe('<Transaction />', () => {
  const transaction = {
    block_hash: 'BKqrzXSbPf1ibBWzdxdT5LvZuKQjRVDKf8FfEdvQ3UcSTgVmK1u',
    consumed_gas: 10100,
    level: null,
    delegate: 'tz3KjhLYva5iYAyGmw8bPZFrErnhw9H21Lg6',
    operation_group_hash: 'oou3oxNVbHtnvBHAJ4noBRD5nR9QcRru8dMweAHi7A23npd7heg',
    fee: 300000,
    public_key: null,
    parameters: null,
    script: null,
    pkh: null,
    destination: 'tz1WAUJCqjTKsJ9D729t1DqXnPdATrYFCmwT',
    nonce: null,
    secret: null,
    block_level: 189957,
    status: 'Ready',
    operation_id: 1421450,
    manager_pubkey: null,
    kind: 'transaction',
    slots: null,
    gas_limit: 10300,
    timestamp: 1550772858000,
    storage_limit: 300,
    amount: 1000000,
    spendable: null,
    delegatable: null,
    source: 'tz1KjhLYva5iYAyGmw8bPZFrErnhw9H21Lg6',
    counter: 16338,
    balance: null
  };
  it('Received transaction', () => {
    const wrapper = setup({
      transaction,
      selectedAccountHash: 'tz1WAUJCqjTKsJ9D729t1DqXnPdATrYFCmwT',
      selectedParentHash: 'tz1WAUJCqjTKsJ9D729t1DqXnPdATrYFCmwT'
    });
    expect(wrapper.find('StateText').text()).toEqual(
      'components.transaction.receivedgeneral.from'
    );
  });

  it('Send transaction', () => {
    const wrapper = setup({
      transaction,
      selectedAccountHash: 'tz1KjhLYva5iYAyGmw8bPZFrErnhw9H21Lg6',
      selectedParentHash: 'tz1KjhLYva5iYAyGmw8bPZFrErnhw9H21Lg6'
    });
    expect(wrapper.find('StateText').text()).toEqual(
      'components.transaction.sentgeneral.to'
    );
  });

  it('ORIGINATION transaction', () => {
    const wrapper = setup({
      transaction: { ...transaction, kind: 'origination' },
      selectedAccountHash: 'tz1KjhLYva5iYAyGmw8bPZFrErnhw9H21Lg6',
      selectedParentHash: 'tz1KjhLYva5iYAyGmw8bPZFrErnhw9H21Lg6'
    });
    expect(wrapper.find('StateText').text()).toEqual(
      'components.transaction.origination'
    );
  });

  it('DELEGATION transaction', () => {
    const wrapper = setup({
      transaction: { ...transaction, kind: 'delegation' },
      selectedAccountHash: 'tz1KjhLYva5iYAyGmw8bPZFrErnhw9H21Lg6',
      selectedParentHash: 'tz1KjhLYva5iYAyGmw8bPZFrErnhw9H21Lg6'
    });
    expect(wrapper.find('StateText').text()).toEqual(
      'components.transaction.updated_delegategeneral.to'
    );
    expect(wrapper.find(TezosAddress)).toHaveLength(1);
  });

  it('ACTIVATION transaction', () => {
    const wrapper = setup({
      transaction: { ...transaction, kind: 'activation' },
      selectedAccountHash: 'tz1KjhLYva5iYAyGmw8bPZFrErnhw9H21Lg6',
      selectedParentHash: 'tz1KjhLYva5iYAyGmw8bPZFrErnhw9H21Lg6'
    });
    expect(wrapper.find('StateText').text()).toEqual(
      'components.transaction.activitationgeneral.of'
    );
  });
});
