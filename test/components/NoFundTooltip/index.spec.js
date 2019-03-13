import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { ThemeProvider } from 'styled-components';
import { I18nextProvider } from 'react-i18next';
import theme from '../../../app/styles/theme';
import NoFundTooltip from '../../../app/components/Tooltips/NoFundTooltip';
import i18n from '../../config/i18nForTests';

Enzyme.configure({ adapter: new Adapter() });

function setup(props) {
  const provider = (
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={i18n}>
        <NoFundTooltip {...props} />
      </I18nextProvider>
    </ThemeProvider>
  );
  return mount(provider);
}

describe('<NoFundTooltip />', () => {
  it('shoud render NoFundTooltip', () => {
    const wrapper = setup({
      content: 'No Found'
    });
    expect(wrapper.find('Container').text()).toEqual('No Found');
  });
});
