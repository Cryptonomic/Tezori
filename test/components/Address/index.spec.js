import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { ThemeProvider } from 'styled-components';
import { I18nextProvider } from 'react-i18next';
import theme from '../../../app/styles/theme';
import Address from '../../../app/components/Address';
import i18n from '../../config/i18nForTests';

import 'jest-styled-components';

Enzyme.configure({ adapter: new Adapter() });

function setup(props) {
  const provider = (
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={i18n}>
        <Address {...props} />
      </I18nextProvider>
    </ThemeProvider>
  );
  return mount(provider);
}

describe('<Address />', () => {
  it('Should render the manager address and should be active', () => {
    const wrapper = setup({
      isManager: true,
      isActive: true,
      balance: 1000000,
      index: 0
    });
    expect(wrapper.find('AddressLabel')).toHaveLength(1);
    expect(wrapper.find('AddressFirstLine')).toHaveStyleRule(
      'color',
      '#FFFFFF'
    );
  });

  it('Should render the manager address and should not be active', () => {
    const wrapper = setup({
      isManager: true,
      isActive: false,
      balance: 1000000,
      index: 0
    });
    expect(wrapper.find('AddressLabel')).toHaveLength(1);
    expect(wrapper.find('AddressFirstLine')).toHaveStyleRule(
      'color',
      '#7691c4'
    );
  });

  it('Should render the delegated address and should be active', () => {
    const wrapper = setup({
      isManager: false,
      isActive: true,
      balance: 1000000,
      index: 0
    });
    expect(wrapper.find('AddressLabel')).toHaveLength(0);
    expect(wrapper.find('AddressFirstLine')).toHaveStyleRule(
      'color',
      '#FFFFFF'
    );
  });

  it('Should render the delegated address and should not be active', () => {
    const wrapper = setup({
      isManager: false,
      isActive: false,
      balance: 1000000,
      index: 0
    });
    expect(wrapper.find('AddressLabel')).toHaveLength(0);
    expect(wrapper.find('AddressFirstLine')).toHaveStyleRule(
      'color',
      '#7691c4'
    );
  });
});
