import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { ThemeProvider } from 'styled-components';
import theme from '../../../app/styles/theme';
import TextField from '../../../app/components/TextField';

Enzyme.configure({ adapter: new Adapter() });

function setup(props) {
  const provider = (
    <ThemeProvider theme={theme}>
      <TextField {...props} />
    </ThemeProvider>
  );
  return mount(provider);
}

describe('<TextField />', () => {
  it('shoud render TextField', () => {
    const wrapper = setup({
      label: 'test'
    });
    expect(wrapper.find('LabelWrapper').text()).toEqual('test');
  });
});
