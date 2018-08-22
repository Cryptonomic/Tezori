import React from 'react';
import styled, { withTheme } from 'styled-components';
import BackCaret from '@material-ui/icons/KeyboardArrowLeft';
import { ms } from '../../styles/helpers';

const Back = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme: { colors } }) => colors.blue3};
  cursor: pointer;
  margin: 0 0 ${ms(2)} 0;
`;

type Props = {
  onClick: Function
};

const BackButton = (props: Props) => {
  const { onClick } = props;
  return (
    <Back onClick={onClick}>
      <BackCaret
        style={{
          fill: '#4486f0',
          height: '28px',
          width: '28px',
          marginRight: '5px',
          marginLeft: '-9px'
        }}
      />
      <span>Back</span>
    </Back>
  );
};

export default withTheme(BackButton);
