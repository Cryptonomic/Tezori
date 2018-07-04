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
`

type Props = {
  onClick?: Function,
  fetchTime: Date,
}

class Update extends PureComponent<Props> {
  render() {
    const { onClick, fetchTime } = this.props
    return (
      <Container>
        <Text>
          {`Last updated ${ moment(fetchTime).format('LT')}`}
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
