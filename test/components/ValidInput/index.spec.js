import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { ThemeProvider } from 'styled-components';
import { I18nextProvider } from 'react-i18next';
import theme from '../../../app/styles/theme';
import ValidInput from '../../../app/components/ValidInput';
import i18n from '../../config/i18nForTests';

Enzyme.configure({ adapter: new Adapter() });

function setup(props) {
  const provider = (
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={i18n}>
        <ValidInput {...props} />
      </I18nextProvider>
    </ThemeProvider>
  );
  return mount(provider);
}

describe('<ValidInput />', () => {
  it('Should be valid', () => {
    const wrapper = setup({
      label: 'test',
      score: 4,
      changFunc: () => {},
      onShow: () => {}
    });
    expect(wrapper.find('CheckIcon')).toHaveLength(1);
  });

  it('An error should exist', () => {
    const wrapper = setup({
      label: 'test',
      score: 1,
      error: 'Error',
      changFunc: () => {},
      onShow: () => {}
    });
    expect(wrapper.find('Error').text()).toEqual('Error');
  });

  it('A suggestion should exist', () => {
    const wrapper = setup({
      label: 'test',
      score: 1,
      suggestion: 'Suggestion',
      changFunc: () => {},
      onShow: () => {}
    });
    expect(wrapper.find('Suggestion').text()).toEqual('Suggestion');
  });
});
