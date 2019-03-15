import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { ThemeProvider } from 'styled-components';
import { I18nextProvider } from 'react-i18next';
import BackCaret from '@material-ui/icons/KeyboardArrowLeft';
import theme from '../../../app/styles/theme';
import BackButton from '../../../app/components/BackButton';
import i18n from '../../config/i18nForTests';

Enzyme.configure({ adapter: new Adapter() });

function setup(props) {
  const provider = (
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={i18n}>
        <BackButton {...props} />
      </I18nextProvider>
    </ThemeProvider>
  );
  return mount(provider);
}

describe('<BackButton />', () => {
  it('shoud render BackButton', () => {
    const wrapper = setup({
      onClick: () => {}
    });
    expect(wrapper.find(BackCaret)).toHaveLength(1);
  });
});
