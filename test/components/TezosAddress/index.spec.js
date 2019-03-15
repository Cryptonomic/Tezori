import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { ThemeProvider } from 'styled-components';
import { I18nextProvider } from 'react-i18next';
import theme from '../../../app/styles/theme';
import TezosAddress from '../../../app/components/TezosAddress';
import CopyIcon from '../../../app/components/CopyIcon';
import i18n from '../../config/i18nForTests';

Enzyme.configure({ adapter: new Adapter() });

function setup(props = {}) {
  const provider = (
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={i18n}>
        <TezosAddress {...props} />
      </I18nextProvider>
    </ThemeProvider>
  );
  return mount(provider);
}

describe('<TezosAddress />', () => {
  it('CopyIcon shoud be exist', () => {
    const wrapper = setup({
      address: 'tz1bYDK6m4RhCjMmCUTfUeuZ1WaiZZcHQZHN',
      text: 'test'
    });
    expect(wrapper.find(CopyIcon)).toHaveLength(1);
  });
  it('CopyIcon shoud not be exist', () => {
    const wrapper = setup({
      address: 'tz1bYDK6m4RhCjMmCUTfUeuZ1WaiZZcHQZHN'
    });
    expect(wrapper.find(CopyIcon)).toHaveLength(0);
  });
});
