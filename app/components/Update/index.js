import React, { PureComponent } from 'react';
import moment from 'moment';
import styled from 'styled-components';
import RefreshIcon from '@material-ui/icons/Refresh';
import { ms } from '../../styles/helpers';

const Container = styled.div`
  display: flex;
  align-items: center;
`;
const Text = styled.span`
  font-size: ${ms(-1.7)};
  font-weight: ${({
    theme: {
      typo: { weights }
    }
  }) => weights.light};
  color: ${({ theme: { colors } }) => colors.white};
  opacity: 0.8;
  margin: 0 ${ms(-2)} 0 0;
`;

const SpinningRefreshIcon = styled(RefreshIcon)`
  -webkit-animation: spin 0.5s linear infinite;
  -moz-animation: spin 0.5s linear infinite;
  animation: spin 0.5s linear infinite;

  @-moz-keyframes spin {
    100% {
      -moz-transform: rotate(360deg);
    }
  }
  @-webkit-keyframes spin {
    100% {
      -webkit-transform: rotate(360deg);
    }
  }
  @keyframes spin {
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
`;

type Props = {
  isReady?: boolean,
  onClick?: () => {},
  time: Date
};

class Update extends PureComponent<Props> {
  render() {
    const { isReady, onClick, time } = this.props;
    const Refresh = isReady ? RefreshIcon : SpinningRefreshIcon;
    return (
      <Container>
        <Text>{`Last updated ${moment(time).format('LT')}`}</Text>
        <Refresh
          style={{
            fill: 'white',
            height: ms(2),
            width: ms(2),
            cursor: 'pointer'
          }}
          onClick={onClick}
        />
      </Container>
    );
  }
}

export default Update;
