import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { ThemeProvider } from 'styled-components';
import { I18nextProvider } from 'react-i18next';
import theme from '../../../app/styles/theme';
import EmptyState from '../../../app/components/EmptyState';
import i18n from '../../config/i18nForTests';

Enzyme.configure({ adapter: new Adapter() });

function setup(props) {
  const provider = (
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={i18n}>
        <EmptyState {...props} />
      </I18nextProvider>
    </ThemeProvider>
  );
  return mount(provider);
}

describe('<EmptyState />', () => {
  it('shoud render EmptyState', () => {
    const wrapper = setup({
      title: 'Test',
      description: <div>Test Description</div>,
      imageSrc: ''
    });
    expect(wrapper.find('Title').text()).toEqual('Test');
  });
});
