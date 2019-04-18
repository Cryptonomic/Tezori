import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { ThemeProvider } from 'styled-components';
import { I18nextProvider } from 'react-i18next';
import theme from '../../../app/styles/theme';
import PageNumbers from '../../../app/components/PageNumbers';
import i18n from '../../config/i18nForTests';

Enzyme.configure({ adapter: new Adapter() });

function setup(props) {
  const provider = (
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={i18n}>
        <PageNumbers {...props} />
      </I18nextProvider>
    </ThemeProvider>
  );
  return mount(provider);
}

describe('<PageNumbers />', () => {
  it('shoud render PageNumbers', () => {
    const wrapper = setup({
      currentPage: 1,
      totalNumber: 20,
      firstNumber: 5,
      lastNumber: 10,
      onClick: () => {}
    });
    expect(wrapper.find('NumberContainer').text()).toEqual(`6-10general.of20`);
  });
});
