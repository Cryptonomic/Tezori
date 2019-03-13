import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { ThemeProvider } from 'styled-components';
import { I18nextProvider } from 'react-i18next';
import theme from '../../../app/styles/theme';
import Info from '../../../app/components/AccountStatus/Info';
import TezosIcon from '../../../app/components/TezosIcon';
import i18n from '../../config/i18nForTests';

Enzyme.configure({ adapter: new Adapter() });

function setup(props) {
  const provider = (
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={i18n}>
        <Info {...props} />
      </I18nextProvider>
    </ThemeProvider>
  );
  return mount(provider);
}

describe('<Info />', () => {
  it('renders 2 icons', () => {
    const operationName = 'Transaction';
    const wrapper = setup({
      firstIconName: 'receive',
      operationName,
      lastIconName: 'info',
      operationId: 'ootiQXFUJGiqkbFKUz7tcDRNpUQ1EVJbX1h7MwrJCHYCyrUJoXW'
    });
    expect(wrapper.find(TezosIcon)).toHaveLength(2);
  });
});
