import React from 'react';
import { compose } from 'redux';
import styled from 'styled-components';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';

import TezosIcon from '../TezosIcon';
import { ms } from '../../styles/helpers';
import { wrapComponent } from '../../utils/i18n';

const focusBorderColors = [
  '#2c7df7',
  '#ea776c',
  '#e69940',
  '#d3b53b',
  '#259c90'
];

const Container = styled.div`
  position: relative;
`;
const Content = styled(FormControl)`
  width: 100%;  
`;

const InputWrapper = styled(Input)`
  &&& {
    &[class*='focused'] {
      &:before {
        border-bottom: solid 2px rgba(0, 0, 0, 0.22);
      }
      &:after {
        width: ${props=>props.width};
        border-bottom-color: ${props=>focusBorderColors[props.score]};
      }
    }
    color: ${({ theme: { colors } }) => colors.primary };
    font-size: 16px;
    font-weight: 300;
    
    &:before {
      border-bottom: solid 1px rgba(0, 0, 0, 0.12);
    }
    &:hover:before {
      border-bottom: solid 2px rgba(0, 0, 0, 0.22) !important;
    }    
  }
}`;
const LabelWrapper = styled(InputLabel)`
  &&& {
    &[class*='focused'] {    
      color: ${({ theme: { colors } }) => colors.gray3 };
    }
    color: rgba(0, 0, 0, 0.38);
    font-size: 16px;
  }
}`;

const PasswordStrengthSuggestions = styled.div`
  height: 3.3rem;
  width: 24rem;
`;
const Suggestion = styled.div`
  font-size: 12px;
  line-height: 18px;
  color: #92949a;
  max-width: 438px;
  span {
    font-weight: bold;
  }
`;
const Error = styled.div`
  font-size: 12px;
  line-height: 18px;
  color: ${props => (props.color)};
`;

const ShowHidePwd = styled.div`
  position: absolute;
  right: 10px;
  top: 26px;
  color: ${({ theme: { colors } }) => colors.accent };
  font-size: 12px;
  font-weight: 500;
`;
const CheckIcon = styled(TezosIcon)`
  position: absolute;
  top: 28px;
  right: 45px;
`;

type Props = {
  label: string,
  error?: string,
  suggestion?: string,
  isShowed?: boolean,
  status?: boolean,
  score?: number,
  changFunc: () => {},
  onShow: () => {},
  t: () => {}
};

const InputValid = (props: Props) => {
  const {score, status, t} = props;
  const borderColor = focusBorderColors[score];
  let width = '';
  if (score && !status) {
    width = `${score * 25}%`;
  } else {
    width = `100%`;
  }

  return (
    <Container>
      <Content>
        <LabelWrapper>
          {props.label}
        </LabelWrapper>
        <InputWrapper
          key={props.label}
          type={props.isShowed ? 'text' : 'password'}
          onChange={(event) => props.changFunc(event.target.value)}
          width={width}
          score={score}
        />        
      </Content>
      {props.score===4 && <CheckIcon
        iconName='checkmark2'
        size={ms(0)}
        color="check"
        onClick={props.onShow}
      />}
      <ShowHidePwd onClick={props.onShow} style={{cursor: 'pointer'}}>
        {t((props.isShowed ? 'general.verbs.hide' : 'general.verbs.show')) }
      </ShowHidePwd>
      <PasswordStrengthSuggestions>
        {!!props.error && <Error color={borderColor}>{props.error}</Error>}
        {!!props.suggestion && (
          <Suggestion dangerouslySetInnerHTML={{ __html: props.suggestion }} />
        )}
      </PasswordStrengthSuggestions>
    </Container>
  );
};
InputValid.defaultProps = {
  error: '',
  suggestion: '',
  score: 0,
  isShowed: false,
  status: false
};

export default compose(wrapComponent)(InputValid);
