import React, { PureComponent } from 'react'
import moment from 'moment'
import styled from 'styled-components'
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';
import { ms } from '../../styles/helpers'

const Container = styled.div`
  display: flex;
  align-items: center;
`
const Text = styled.span`
  font-size: ${ms(-1.7)};
  font-weight: ${ ({ theme: { typo: { weights } } }) => weights.light };
  color: ${ ({ theme: { colors } }) => colors.white };
  opacity: 0.8;
  margin: 0 ${ms(-2)} 0 0;
`

type Props = {
  onClick?: Function,
  time: Date,
}

class Update extends PureComponent<Props> {
  render() {
    const { onClick, time } = this.props
    return (
      <Container>
        <Text>
          {`Last updated ${ moment(time).format('LT')}`}
        </Text>
        <RefreshIcon
          style={{
            fill: 'white',
            height: ms(2),
            width: ms(2),
            cursor: 'pointer',
            transform: 'scaleX(-1)',
          }}
          onClick={onClick}
        />
      </Container>
    )
  }
}

export default Update
