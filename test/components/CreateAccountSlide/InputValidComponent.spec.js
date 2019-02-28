import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { ThemeProvider } from 'styled-components';
import { I18nextProvider } from 'react-i18next';
import theme from '../../../app/styles/theme';
import InputValidComponent from '../../../app/components/CreateAccountSlide/InputValidComponent';
import i18n from '../../config/i18nForTests';

Enzyme.configure({ adapter: new Adapter() });

function setup(props) {
  const provider = (
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={i18n}>
        <InputValidComponent {...props} />
      </I18nextProvider>
    </ThemeProvider>
  );
  return mount(provider);
}

describe('<InputValidComponent />', () => {
  it('Should render First word', () => {
    const wrapper = setup({
      value: 'economy',
      index: 1,
      checkValidation: () => {},
      onEnter: () => {}
    });
    expect(wrapper.find('LabelWrapper').text()).toEqual(
      'components.createAccountSlide.first_word'
    );
  });

  it('Should render Second word', () => {
    const wrapper = setup({
      value: 'economy',
      index: 2,
      checkValidation: () => {},
      onEnter: () => {}
    });
    expect(wrapper.find('LabelWrapper').text()).toEqual(
      'components.createAccountSlide.second_word'
    );
  });

  it('Should render nth word', () => {
    const wrapper = setup({
      value: 'economy',
      index: 5,
      checkValidation: () => {},
      onEnter: () => {}
    });
    expect(wrapper.find('LabelWrapper').text()).toEqual(
      'components.createAccountSlide.nth_word'
    );
  });
});
