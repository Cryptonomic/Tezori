import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { ThemeProvider } from 'styled-components';
import { I18nextProvider } from 'react-i18next';
import theme from '../../../app/styles/theme';
import BackUpSeedPhrase from '../../../app/components/CreateAccountSlide/BackUpSeedPhrase';
import InputValidComponent from '../../../app/components/CreateAccountSlide/InputValidComponent';
import i18n from '../../config/i18nForTests';

Enzyme.configure({ adapter: new Adapter() });

function setup(props) {
  const provider = (
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={i18n}>
        <BackUpSeedPhrase {...props} />
      </I18nextProvider>
    </ThemeProvider>
  );
  return mount(provider);
}

describe('<BackUpSeedPhrase />', () => {
  it('Should render seeds', () => {
    const wrapper = setup({
      seed:
        'economy allow chef brave erosion talk panic mirror tail message letter pact remove final pizza',
      nextAccountSlide: () => {}
    });
    expect(wrapper.find(InputValidComponent)).toHaveLength(4);
  });
});
