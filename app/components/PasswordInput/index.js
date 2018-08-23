import React from 'react';
import { compose } from 'redux';
import styled from 'styled-components';

import TextField from '../TextField';
import { wrapComponent } from '../../utils/i18n';

const Container = styled.div`
  position: relative;
`;

const ShowHidePwd = styled.div`
  position: absolute;
  right: 10px;
  top: 22px;
  color: ${({ theme: { colors } }) => colors.accent };
  font-size: 12px;
  font-weight: 500;
`;

type Props = {
  label: string,
  isShowed?: boolean,
  containerStyle?: object,
  password: string,
  changFunc: () => {},
  onShow: () => {},
  t: () => {}
};

const PasswordInput = (props: Props) => {
  const { label, password, isShowed, changFunc, onShow, containerStyle, t } = props;
  return (
    <Container style={containerStyle}>
      <TextField
        label={label}
        type={isShowed? 'text': 'password'}
        value={password}
        onChange={(newVal) => changFunc(newVal)}
        right={42}
      />
      <ShowHidePwd style={{cursor: 'pointer'}} onClick={onShow}>
        {t((isShowed ? 'general.verbs.hide' : 'general.verbs.show')) }
      </ShowHidePwd>
    </Container>
  )
};

PasswordInput.defaultProps = {
  isShowed: false,
  containerStyle: {}
}

export default compose(wrapComponent)(PasswordInput)
