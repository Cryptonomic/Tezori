import React, { Component } from 'react';
import Warning from '@material-ui/icons/Warning';
import styled from 'styled-components';
import TextField from '../TextField';
import { ms } from '../../styles/helpers';
import TezosIcon from '../TezosIcon';
import { wrapComponent } from '../../utils/i18n';

const StyledInputContainer = styled.div`
  position: relative;
  height: 103px;
  padding-top: 16px;
  width: 45%;
`;

const CheckIcon = styled(TezosIcon)`
  position: absolute;
  top: 42px;
  right: 5px;
`;

const WarningIcon = styled(Warning)`
  &&& {
    position: absolute;
    right: 12px;
    top: 42px;
    fill: ${({ theme: { colors } }) => colors.error1};
    width: 18px;
    height: 18px;
  }
`;

const validIcon = (isShow: boolean = false, isValid: boolean = false) => {
  if (!isShow) {
    return null;
  }
  if (isValid) {
    return <CheckIcon iconName="checkmark2" size={ms(0)} color="check" />;
  }
  return <WarningIcon />;
};

type Props = {
  value: string,
  index: number,
  checkValidation: () => {},
  onEnter: () => {},
  t: () => {}
};

class InputValidComponent extends Component<Props> {
  props: Props;
  state = {
    isInputVal: false,
    isMatching: false,
    isMatched: false,
    errorText: ''
  };

  getLabel = index => {
    const { t } = this.props;
    switch (`${index}`) {
      case '1':
        return t('components.createAccountSlide.first_word');
      case '2':
        return t('components.createAccountSlide.second_word');
      case '3':
        return t('components.createAccountSlide.third_word');
      default:
        return t('components.createAccountSlide.nth_word', { index });
    }
  };

  changFunc = val => {
    if (!this.state.isInputVal) {
      this.setState({ isInputVal: true });
    }
    let isValid = false;

    if (val) {
      const index = this.props.value.indexOf(val);
      if (val === this.props.value) {
        this.setState({ isMatched: true, isMatching: false, errorText: '' });
        isValid = true;
      } else if (index < 0) {
        this.setState({
          isMatched: false,
          isMatching: false,
          errorText: 'components.createAccountSlide.errors.invalid_word'
        });
      } else {
        this.setState({ isMatched: false, isMatching: true, errorText: '' });
      }
    } else {
      this.setState({
        isMatched: false,
        isMatching: false,
        errorText: 'components.createAccountSlide.errors.typo_error'
      });
    }

    this.props.checkValidation(isValid);
  };
  keyHandler = ev => {
    if (ev.key === 'Enter') {
      this.props.onEnter();
      ev.preventDefault();
    }
  };

  render() {
    const { index, t } = this.props;
    const label = this.getLabel(index);
    const { errorText } = this.state;
    return (
      <StyledInputContainer>
        <TextField
          label={label}
          onChange={newVal => this.changFunc(newVal)}
          errorText={t(errorText)}
          onKeyPress={this.keyHandler}
        />
        {validIcon(
          this.state.isInputVal && !this.state.isMatching,
          this.state.isMatched
        )}
      </StyledInputContainer>
    );
  }
}

export default wrapComponent(InputValidComponent);
