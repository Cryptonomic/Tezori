import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { ThemeProvider } from 'styled-components';
import theme from '../../../app/styles/theme';
import CustomModal from '../../../app/components/CustomModal';

Enzyme.configure({ adapter: new Adapter() });

function setup(props) {
  const provider = (
    <ThemeProvider theme={theme}>
      <CustomModal {...props} />
    </ThemeProvider>
  );
  return mount(provider);
}

describe('<CustomModal />', () => {
  it('shoud be open', () => {
    const wrapper = setup({
      title: 'Test',
      open: true,
      onClose: () => {}
    });
    expect(wrapper.find('ModalTitle').text()).toEqual('Test');
  });

  it('shoud not be open', () => {
    const wrapper = setup({
      title: 'Test',
      open: false,
      onClose: () => {}
    });
    expect(wrapper.find('ModalTitle')).toHaveLength(0);
  });
});
