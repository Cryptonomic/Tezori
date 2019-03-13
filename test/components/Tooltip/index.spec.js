import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import styled, { ThemeProvider } from 'styled-components';
import theme from '../../../app/styles/theme';
import Tooltip from '../../../app/components/Tooltip';
import CopyIcon from '../../../app/components/CopyIcon';

Enzyme.configure({ adapter: new Adapter() });

const CopyContent = styled.span`
  display: flex;
  alignitems: center;
  font-size: 15px;
`;
type ContentProps = {
  formatedBalance: string
};

const Content = (props: ContentProps) => {
  const { formatedBalance } = props;
  return (
    <CopyContent>
      {formatedBalance}
      <CopyIcon text={formatedBalance} color="primary" />
    </CopyContent>
  );
};

function setup(props = {}) {
  const provider = (
    <ThemeProvider theme={theme}>
      <Tooltip {...props} content={<Content formatedBalance="100000" />}>
        <div className="tooltip-btn">test</div>
      </Tooltip>
    </ThemeProvider>
  );
  return mount(provider);
}

describe('<Tooltip />', () => {
  it('shoud not be exist', () => {
    const wrapper = setup({
      trigger: ['click']
    });
    expect(wrapper.find('CopyContent')).toHaveLength(0);
  });
});
