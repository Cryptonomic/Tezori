import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { ThemeProvider } from 'styled-components';
import { I18nextProvider } from 'react-i18next';
import theme from '../../../app/styles/theme';
import CopyIcon from '../../../app/components/CopyIcon';
import i18n from '../../config/i18nForTests';

import 'jest-styled-components';

Enzyme.configure({ adapter: new Adapter() });

function setup(props) {
  const provider = (
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={i18n}>
        <CopyIcon {...props} />
      </I18nextProvider>
    </ThemeProvider>
  );
  return mount(provider);
}

describe('<CopyIcon />', () => {
  it('Tooltip should not be exist', () => {
    const wrapper = setup({
      text: 'Test'
    });
    expect(wrapper.find('CopyConfirmationTooltip')).toHaveStyleRule(
      'opacity',
      '0'
    );
  });

  it('Tooltip should be exist', () => {
    const wrapper = setup({
      text: 'Test'
    });
    wrapper.find('Container').simulate('click');
    expect(wrapper.find('CopyConfirmationTooltip')).toHaveStyleRule(
      'opacity',
      '1'
    );
  });
});
