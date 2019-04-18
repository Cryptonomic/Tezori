import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { ThemeProvider } from 'styled-components';
import { I18nextProvider } from 'react-i18next';
import theme from '../../../app/styles/theme';
import BalanceBanner from '../../../app/components/BalanceBanner';
import Tooltip from '../../../app/components/Tooltip/';
import i18n from '../../config/i18nForTests';

import 'jest-styled-components';
import mockIdentify from '../../config/mockData';

Enzyme.configure({ adapter: new Adapter() });

function setup(props = {}) {
  const provider = (
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={i18n}>
        <BalanceBanner {...props} />
      </I18nextProvider>
    </ThemeProvider>
  );
  return mount(provider);
}

describe('<BalanceBanner />', () => {
  it('Tooltip shoud be exist', () => {
    const wrapper = setup({
      storeType: 'Fundraiser',
      isReady: true,
      balance: 899997259,
      publicKeyHash: 'tz1WAUJCqjTKsJ9D729t1DqXnPdATrYFCmwT',
      onRefreshClick: () => {},
      isManagerAddress: true,
      parentIndex: 0,
      parentIdentity: mockIdentify,
      delegatedAddress: '',
      isWalletSyncing: false,
      time: new Date()
    });
    expect(wrapper.find(Tooltip)).toHaveLength(2);
  });

  it('Tooltip shoud not be exist', () => {
    const wrapper = setup({
      storeType: 'Fundraiser',
      isReady: true,
      balance: 899997259,
      publicKeyHash: 'tz1WAUJCqjTKsJ9D729t1DqXnPdATrYFCmwT',
      onRefreshClick: () => {},
      isManagerAddress: false,
      parentIndex: 0,
      parentIdentity: mockIdentify,
      delegatedAddress: '',
      isWalletSyncing: false,
      time: new Date()
    });
    expect(wrapper.find(Tooltip)).toHaveLength(1);
  });

  it('DelegatedAddress shoud be exist', () => {
    const wrapper = setup({
      storeType: 'Fundraiser',
      isReady: true,
      balance: 899997259,
      publicKeyHash: 'tz1WAUJCqjTKsJ9D729t1DqXnPdATrYFCmwT',
      onRefreshClick: () => {},
      isManagerAddress: true,
      parentIndex: 0,
      parentIdentity: mockIdentify,
      delegatedAddress: 'tz3gN8NTLNLJg5KRsUU47NHNVHbdhcFXjjaB',
      isWalletSyncing: false,
      time: new Date()
    });
    expect(wrapper.find('DelegateContainer')).toHaveLength(1);
  });

  it('DelegatedAddress shoud not be exist', () => {
    const wrapper = setup({
      storeType: 'Fundraiser',
      isReady: true,
      balance: 899997259,
      publicKeyHash: 'tz1WAUJCqjTKsJ9D729t1DqXnPdATrYFCmwT',
      onRefreshClick: () => {},
      isManagerAddress: false,
      parentIndex: 0,
      parentIdentity: mockIdentify,
      delegatedAddress: '',
      isWalletSyncing: false,
      time: new Date()
    });
    expect(wrapper.find('DelegateContainer')).toHaveLength(0);
  });
});
