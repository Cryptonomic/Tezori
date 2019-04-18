import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { ThemeProvider } from 'styled-components';
import { I18nextProvider } from 'react-i18next';
import theme from '../../../app/styles/theme';
import ManagerAddressTooltip from '../../../app/components/Tooltips/ManagerAddressTooltip';
import i18n from '../../config/i18nForTests';

Enzyme.configure({ adapter: new Adapter() });

function setup(props) {
  const provider = (
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={i18n}>
        <ManagerAddressTooltip {...props} />
      </I18nextProvider>
    </ThemeProvider>
  );
  return mount(provider);
}

describe('<ManagerAddressTooltip />', () => {
  it('shoud render ManagerAddressTooltip', () => {
    const wrapper = setup();
    expect(wrapper.find('Title').text()).toEqual(
      'components.address.manager_address'
    );
  });
});
