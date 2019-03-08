import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { ThemeProvider } from 'styled-components';
import { I18nextProvider } from 'react-i18next';
import { fromJS } from 'immutable';
import theme from '../../../app/styles/theme';
import AccountStatus from '../../../app/components/AccountStatus';
import i18n from '../../config/i18nForTests';

import 'babel-polyfill';

Enzyme.configure({ adapter: new Adapter() });

function setup(props) {
  const provider = (
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={i18n}>
        <AccountStatus {...props} />
      </I18nextProvider>
    </ThemeProvider>
  );
  return mount(provider);
}

describe('<AccountStatus />', () => {
  const selectedAccount = {
    accounts: [],
    activeTab: 'general.nouns.transactions',
    balance: 1001737440,
    operations: {},
    privateKey:
      'edskRtrHB9kqd4SpMPby66W7FGXF5C3bNHEYJSU9Trh6Ge4v1uMnKhUKJk1u2aqv7L5broxPnYJ9V6kuRddBB39uGJYYNHZ6jP',
    publicKey: 'edpkuBdVavWqGLNNYeQahc82YfAP2G9C9WXbS6VkyNBVkot4zeXzoo',
    publicKeyHash: 'tz1bYDK6m4RhCjMmCUTfUeuZ1WaiZZcHQZHN',
    status: 'Ready',
    storeType: 'Mnemonic',
    transactions: [
      {
        block_hash: 'BKvGRSkbPYPP1K4HwxWFQQWLZv484pbwPG3D7PA7P8j327NV8fB',
        consumed_gas: 10100,
        level: null,
        delegate: null,
        operation_group_hash:
          'ootiQXFUJGiqkbFKUz7tcDRNpUQ1EVJbX1h7MwrJCHYCyrUJoXW',
        fee: 1452,
        public_key: null,
        parameters: null,
        script: null,
        pkh: null,
        destination: 'tz1bYDK6m4RhCjMmCUTfUeuZ1WaiZZcHQZHN',
        nonce: null,
        secret: null,
        block_level: 192327,
        status: 'Ready',
        operation_id: 1444011,
        manager_pubkey: null,
        kind: 'transaction',
        slots: null,
        gas_limit: 10300,
        timestamp: 1550852238000,
        storage_limit: 300,
        amount: 100000000,
        spendable: null,
        delegatable: null,
        source: 'tz1WAUJCqjTKsJ9D729t1DqXnPdATrYFCmwT',
        counter: 27048,
        balance: null
      },
      {
        block_hash: 'BLmKgSbbdFvzK7msj2u3KECuzhoCzT6qE1BeihVwdZbGEArkrU4',
        consumed_gas: 10100,
        level: null,
        delegate: null,
        operation_group_hash:
          'ootFhtS8LFxinBhr9JoxThMu6F6SKJQcASRJDwseL2ETwpHZhaQ',
        fee: 2741,
        public_key: null,
        parameters: null,
        script: null,
        pkh: null,
        destination: 'tz1bYDK6m4RhCjMmCUTfUeuZ1WaiZZcHQZHN',
        nonce: null,
        secret: null,
        block_level: 192282,
        status: 'Ready',
        operation_id: 1443667,
        manager_pubkey: null,
        kind: 'transaction',
        slots: null,
        gas_limit: 10300,
        timestamp: 1550850368000,
        storage_limit: 300,
        amount: 100000000,
        spendable: null,
        delegatable: null,
        source: 'KT1HE1JLUZwsVYaCTBaGUnk652TfvWWeBsCu',
        counter: 2,
        balance: null
      }
    ]
  };
  it('in case of created', () => {
    const wrapper = setup({
      isManager: true,
      address: fromJS({
        ...selectedAccount,
        status: 'Created'
      })
    });
    expect(wrapper.find('Title').text()).toEqual(
      'components.accountStatus.titles.ready'
    );
    expect(wrapper.find('Description').text()).toEqual(
      'components.accountStatus.descriptions.mnemonic_first_transaction'
    );
  });
  it('in case of pending', () => {
    const wrapper = setup({
      isManager: true,
      address: fromJS({
        ...selectedAccount,
        status: 'Pending'
      })
    });
    expect(wrapper.find('Title').text()).toEqual(
      'components.accountStatus.titles.pending'
    );
    expect(wrapper.find('Description').text()).toEqual(
      'components.accountStatus.descriptions.first_transaction_confirmation'
    );
  });
});
