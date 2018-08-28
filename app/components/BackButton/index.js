import React from 'react';
import { compose } from 'redux';
import styled, { withTheme } from 'styled-components';
import BackCaret from '@material-ui/icons/KeyboardArrowLeft';
import { ms } from '../../styles/helpers';
import { wrapComponent } from '../../utils/i18n';

const Back = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme: { colors } }) => colors.blue3};
  cursor: pointer;
  margin: 0 0 ${ms(2)} 0;
`;

type Props = {
  onClick: () => {},
  t: () => {}
};

const BackButton = (props: Props) => {
  const { onClick, t } = props;
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
      <span>{t("general.back")}</span>
    </Back>
  );
};

export default compose(wrapComponent, withTheme)(BackButton);
