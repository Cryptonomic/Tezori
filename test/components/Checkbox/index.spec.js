import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { ThemeProvider } from 'styled-components';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Circle from '@material-ui/icons/PanoramaFishEye';
import theme from '../../../app/styles/theme';
import Checkbox from '../../../app/components/Checkbox';

Enzyme.configure({ adapter: new Adapter() });

function setup(props) {
  const provider = (
    <ThemeProvider theme={theme}>
      <Checkbox {...props} />
    </ThemeProvider>
  );
  return mount(provider);
}

describe('<Checkbox />', () => {
  it('shoud be checked', () => {
    const wrapper = setup({
      isChecked: true,
      onCheck: () => {}
    });
    expect(wrapper.find(CheckCircle)).toHaveLength(1);
  });

  it('shoud not be checked', () => {
    const wrapper = setup({
      isChecked: false,
      onCheck: () => {}
    });
    expect(wrapper.find(Circle)).toHaveLength(1);
  });
});
