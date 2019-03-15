import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { ThemeProvider } from 'styled-components';
import { I18nextProvider } from 'react-i18next';
import theme from '../../../app/styles/theme';
import PasswordInput from '../../../app/components/PasswordInput';
import i18n from '../../config/i18nForTests';

Enzyme.configure({ adapter: new Adapter() });

function setup(props) {
  const provider = (
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={i18n}>
        <PasswordInput {...props} />
      </I18nextProvider>
    </ThemeProvider>
  );
  return mount(provider);
}

describe('<PasswordInput />', () => {
  it('Password should not be showed', () => {
    const wrapper = setup({
      label: 'Test',
      password: '',
      isShowed: true,
      changFunc: () => {},
      onShow: () => {}
    });
    expect(wrapper.find('ShowHidePwd').text()).toEqual('general.verbs.hide');
  });

  it('Password should be showed', () => {
    const wrapper = setup({
      label: 'Test',
      password: '',
      isShowed: false,
      changFunc: () => {},
      onShow: () => {}
    });
    expect(wrapper.find('ShowHidePwd').text()).toEqual('general.verbs.show');
  });
});
